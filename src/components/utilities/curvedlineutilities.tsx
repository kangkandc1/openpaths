import * as turf from '@turf/turf';
import { GeojsonLineString, GeojsonEdgeCollection } from '../../interfaces/geometricalobjects';

/**
 * Creates a perturbed/curved line to avoid overlap with other lines
 * @param line The line to perturb
 * @param index The index of this line in the bundle
 * @param total Total number of overlapping lines
 * @returns A new line with perturbed geometry
 */

function createPerturbedLine(
    line: GeojsonLineString,
    index: number,
    total: number
): GeojsonLineString {
    const coords = line.geometry;
    const start = coords[0];
    const end = coords[coords.length - 1];

    // Spread angle across all overlapping lines
    const angle = -15 + (30 / (total - 1)) * index;

    // Base offset (km). Tune manually.
    const bulgeDist = 0.002;

    // Compute length once
    const lineLength = turf.distance(start, end, { units: "kilometers" });

    // Interpolated raw positions along the straight segment
    const oneThirdPoint = turf.along(
        turf.lineString([start, end]),
        lineLength / 3,
        { units: "kilometers" }
    );

    const twoThirdPoint = turf.along(
        turf.lineString([start, end]),
        2 * lineLength / 3,
        { units: "kilometers" }
    );

    // Offset both intermediate points sideways
    const bulge1 = turf.destination(
        oneThirdPoint,
        bulgeDist,
        angle,
        { units: "kilometers" }
    );

    const bulge2 = turf.destination(
        twoThirdPoint,
        bulgeDist,
        angle,
        { units: "kilometers" }
    );

    // IMPORTANT: geometry must be [number, number][]
    const newGeometry: [number, number][] = [
        start,
        bulge1.geometry.coordinates as [number, number],
        bulge2.geometry.coordinates as [number, number],
        end
    ];

    return {
        ...line,
        geometry: newGeometry
    };
}

/**
 * Returns elements in setA that are not in setB
 */
function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const result = new Set<T>();
    setA.forEach(x => {
        if (!setB.has(x)) {
            result.add(x);
        }
    });
    return result;
}

/**
 * Checks if two links overlap (connect the same two nodes)
 * @param focal The focal link to check
 * @param other The other link to compare against
 * @returns true if the links connect the same nodes and have different IDs
 */
function checkIfOverlap(focal: GeojsonLineString, other: GeojsonLineString): boolean {
    const focalNodes = new Set([focal.properties.idStartPoint, focal.properties.idEndPoint]);
    const otherNodes = new Set([other.properties.idStartPoint, other.properties.idEndPoint]);

    console.log('Checking overlap:', {
        focal: { id: focal.properties.id, nodes: [focal.properties.idStartPoint, focal.properties.idEndPoint] },
        other: { id: other.properties.id, nodes: [other.properties.idStartPoint, other.properties.idEndPoint] },
        diff: difference(focalNodes, otherNodes).size,
        sameNodes: difference(focalNodes, otherNodes).size === 0,
        differentIds: focal.properties.id !== other.properties.id
    });

    // Check if they connect the same nodes but are different links (different IDs)
    if ((difference(focalNodes, otherNodes).size === 0) && (focal.properties.id !== other.properties.id)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Gets all links that overlap with a given link
 * @param link The link to check for overlaps
 * @param allEdges All edges in the collection
 * @returns Array of overlapping links
 */
function getOverlapsForLink(link: GeojsonLineString, allEdges: GeojsonEdgeCollection): GeojsonLineString[] {
    const overlappingLinks = allEdges.Features.filter((edge) => checkIfOverlap(link, edge));
    return overlappingLinks;
}

/**
 * Separates edges into overlapping and non-overlapping groups
 * @param allEdges All edges in the collection
 * @returns Object with nonOverlappingLinks and overlappingLinks arrays
 */
function separateOverlappingLinks(allEdges: GeojsonEdgeCollection): {
    nonOverlappingLinks: GeojsonLineString[];
    overlappingLinks: GeojsonLineString[][];
} {
    let nonOverlappingLinks: GeojsonLineString[] = [];
    let overlappingLinks: GeojsonLineString[][] = [];
    let idsOfOverlappingLinks: (string | number)[] = [];

    console.log('Total edges to process:', allEdges.Features.length);

    allEdges.Features.forEach(element => {
        if (idsOfOverlappingLinks.includes(element.properties.id)) {
            console.log("Already processed:", element.properties.id);
        } else {
            const commonLinks = getOverlapsForLink(element, allEdges);
            console.log('Found overlaps for', element.properties.id, ':', commonLinks.length);

            if (commonLinks.length === 0) {
                nonOverlappingLinks.push(element);
            } else {
                commonLinks.forEach((l) => {
                    idsOfOverlappingLinks.push(l.properties.id);
                });
                // Add the focal element's ID as well
                idsOfOverlappingLinks.push(element.properties.id);

                // Create bundle with all overlapping links including the focal one
                const bundle = [...commonLinks, element];
                console.log('Creating bundle with', bundle.length, 'links');
                overlappingLinks.push(bundle);
            }
        }
    });

    console.log("Finished separating links:", {
        nonOverlapping: nonOverlappingLinks.length,
        overlappingBundles: overlappingLinks.length
    });
    return { nonOverlappingLinks, overlappingLinks };
}

/**
 * Modifies a bundle of overlapping links to create curved lines
 * @param linkBundle Array of overlapping links
 * @returns Array of links with curved geometries
 */
function modifyLinkBundle(linkBundle: GeojsonLineString[]): GeojsonLineString[] {
    const perturbedLines = linkBundle.map((line, i) => createPerturbedLine(line, i, linkBundle.length));
    const mySplines: GeojsonLineString[] = [];

    perturbedLines.forEach(element => {
        console.log(element.geometry);
        const curvedInput = turf.lineString(element.geometry);
        const curvedLine = turf.bezierSpline(curvedInput, { resolution: 100,sharpness:1 });

        const splineCoords = curvedLine.geometry.coordinates as [number, number][];

        // Append the original last point if it's not already the same
        const lastOriginal = element.geometry[element.geometry.length - 1];
        const lastSpline = splineCoords[splineCoords.length - 1];
        if (lastOriginal[0] !== lastSpline[0] || lastOriginal[1] !== lastSpline[1]) {
            splineCoords.push(lastOriginal);
        }

        const thisSpline: GeojsonLineString = {
            ...element,
            geometry: curvedLine.geometry.coordinates as [number, number][],
        };

        mySplines.push(thisSpline);
    });

    return mySplines;
}

/**
 * Converts overlapping links to splines (curved lines)
 * @param overlappingLinks Array of overlapping link bundles
 * @returns Array of links with curved geometries
 */
function convertOverlappingLinksToSplines(overlappingLinks: GeojsonLineString[][]): GeojsonLineString[] {
    let generatedSplines: GeojsonLineString[] = [];

    overlappingLinks.forEach(bundle => {
        const splinedBundle = modifyLinkBundle(bundle);
        generatedSplines.push(...splinedBundle);
    });

    return generatedSplines;
}

/**
 * Main function to transform edge geometries to handle overlaps
 * Converts overlapping straight lines into curved lines for better visualization
 * @param edgesCollection The collection of edges to process
 * @returns A new edge collection with curved geometries for overlapping links
 */
export const changeLinkGeometries = (edgesCollection: GeojsonEdgeCollection): GeojsonEdgeCollection => {
    // Handle empty or undefined edge collections
    if (!edgesCollection || !edgesCollection.Features || edgesCollection.Features.length === 0) {
        return edgesCollection;
    }

    const separatedLinks = separateOverlappingLinks(edgesCollection);
    let newFeatures: GeojsonLineString[] = [];

    // Add non-overlapping links as-is
    newFeatures = [...separatedLinks.nonOverlappingLinks];

    // Convert overlapping links to splines and add them
    const splinedVersionOfOverlappingLinks = convertOverlappingLinksToSplines(separatedLinks.overlappingLinks);

    splinedVersionOfOverlappingLinks.forEach((l) => {
        newFeatures.push(l);
    });

    return { type: "FeatureCollection", Features: newFeatures };
};
