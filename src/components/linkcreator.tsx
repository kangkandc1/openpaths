import { useState, useEffect } from "react";
import Select from 'react-select';
import { useStationContext } from "../services/stationserviceprovider";
import { PathwayModes } from "../interfaces/common";
import { GeojsonPoint, GeojsonLineString } from "../interfaces/geometricalobjects";

interface DropdownOption {
    value: string | number;
    label: string;
    coordinates?: [number, number];
    level?: number;
}

export const LinkCreator = ({ onLinkPreview, onLinkCreate, onNodeSelection }: {
    onLinkPreview: (link: GeojsonLineString | null) => void;
    onLinkCreate: (link: GeojsonLineString) => void;
    onNodeSelection?: (startCoord: [number, number] | null, endCoord: [number, number] | null) => void;
}) => {
    const { getStationModel, addNode, getAllNodes } = useStationContext();

    const [startNodeId, setStartNodeId] = useState<string | number | null>(null);
    const [startNodeName, setStartNodeName] = useState<string>('');
    const [startNodeCoord, setStartNodeCoord] = useState<[number, number] | null>(null);

    const [endNodeId, setEndNodeId] = useState<string | number | null>(null);
    const [endNodeName, setEndNodeName] = useState<string>('');
    const [endNodeCoord, setEndNodeCoord] = useState<[number, number] | null>(null);

    const [pathwayMode, setPathwayMode] = useState<PathwayModes | null>(null);
    const [pathwayModeName, setPathwayModeName] = useState<string>('');

    const [duration, setDuration] = useState<number>(0);
    const [distance, setDistance] = useState<number>(0);

    const [previewMode, setPreviewMode] = useState<boolean>(false);
    const [startNodeLevel, setStartNodeLevel] = useState<number | undefined>(undefined);

    // Create dropdown options from nodes
    const createNodeDropdown = (): DropdownOption[] => {
        const nodes = getStationModel().nodes.features;
        return nodes.map((node: GeojsonPoint) => ({
            value: node.properties.id,
            label: node.properties.name,
            coordinates: node.geometry.coordinates,
            level: node.properties.level
        }));
    };

    // Filter allowed destinations based on pathway mode and start node level
    const getAllowedDestinations = (
        allNodes: DropdownOption[],
        startLevel: number | undefined,
        mode: PathwayModes | null
    ): DropdownOption[] => {
        // If no start node or pathway mode selected, return all nodes
        if (startLevel === undefined || mode === null) {
            return allNodes;
        }

        // Walkway and Fare Gate: only same level allowed
        if (mode === PathwayModes.Walkway || mode === PathwayModes["Fare Gate"]) {
            return allNodes.filter(node => node.level === startLevel);
        }

        // All other modes (Stairs, Escalator, Elevator, Ramp, Moving sidewalk):
        // only different levels allowed
        return allNodes.filter(node => node.level !== startLevel);
    };

    // Pathway mode options
    const pathwayModeOptions = [
        { value: PathwayModes.Walkway, label: "Walkway" },
        { value: PathwayModes.Stairs, label: "Stairs" },
        { value: PathwayModes["Moving sidewalk/travelator"], label: "Moving sidewalk/travelator" },
        { value: PathwayModes.Escalator, label: "Escalator" },
        { value: PathwayModes.Elevator, label: "Elevator" },
        { value: PathwayModes["Fare Gate"], label: "Fare Gate" },
        { value: PathwayModes.Ramp, label: "Ramp" }
    ];

    const nodeDropdown = createNodeDropdown();
    const allowedEndNodes = getAllowedDestinations(nodeDropdown, startNodeLevel, pathwayMode);

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = coord1[1] * Math.PI / 180;
        const φ2 = coord2[1] * Math.PI / 180;
        const Δφ = (coord2[1] - coord1[1]) * Math.PI / 180;
        const Δλ = (coord2[0] - coord1[0]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    // Create preview link
    const createPreviewLink = (): GeojsonLineString | null => {
        if (!startNodeId || !endNodeId || pathwayMode === null) return null;

        const nodes = getStationModel().nodes.features;
        const startNode = nodes.find(n => n.properties.id === startNodeId);
        const endNode = nodes.find(n => n.properties.id === endNodeId);

        if (!startNode || !endNode) return null;

        const calculatedDistance = calculateDistance(
            startNode.geometry.coordinates,
            endNode.geometry.coordinates
        );

        const link: GeojsonLineString = {
            type: "Feature",
            geometry: [startNode.geometry.coordinates, endNode.geometry.coordinates],
            properties: {
                name: `${startNodeName} to ${endNodeName}`,
                id: `link-${Date.now()}`,
                idStartPoint: startNodeId,
                idEndPoint: endNodeId,
                mode: pathwayMode,
                duration: duration || 0,
                distance: distance || calculatedDistance
            }
        };

        return link;
    };

    // Handle start node selection
    const handleStartNodeChange = (option: DropdownOption | null) => {
        if (option) {
            setStartNodeId(option.value);
            setStartNodeName(option.label);
            setStartNodeLevel(option.level);
            setStartNodeCoord(option.coordinates || null);
        } else {
            setStartNodeId(null);
            setStartNodeName('');
            setStartNodeLevel(undefined);
            setStartNodeCoord(null);
        }
        // Clear end node selection when start node changes
        setEndNodeId(null);
        setEndNodeName('');
        setEndNodeCoord(null);
        setPreviewMode(false);
        onLinkPreview(null);

        // Notify parent of node selection
        if (onNodeSelection) {
            onNodeSelection(option?.coordinates || null, null);
        }
    };

    // Handle end node selection
    const handleEndNodeChange = (option: DropdownOption | null) => {
        if (option) {
            setEndNodeId(option.value);
            setEndNodeName(option.label);
            setEndNodeCoord(option.coordinates || null);
        } else {
            setEndNodeId(null);
            setEndNodeName('');
            setEndNodeCoord(null);
        }
        setPreviewMode(false);
        onLinkPreview(null);

        // Notify parent of node selection
        if (onNodeSelection) {
            onNodeSelection(startNodeCoord, option?.coordinates || null);
        }
    };

    // Handle pathway mode selection
    const handlePathwayModeChange = (option: any) => {
        if (option) {
            setPathwayMode(option.value);
            setPathwayModeName(option.label);
        } else {
            setPathwayMode(null);
            setPathwayModeName('');
        }
        // Clear end node selection when pathway mode changes
        setEndNodeId(null);
        setEndNodeName('');
        setPreviewMode(false);
        onLinkPreview(null);
    };

    // Update preview when inputs change
    useEffect(() => {
        if (startNodeId && endNodeId && pathwayMode !== null) {
            const previewLink = createPreviewLink();
            if (previewMode && previewLink) {
                onLinkPreview(previewLink);
            }
        }
    }, [startNodeId, endNodeId, pathwayMode, duration, distance, previewMode]);

    // Toggle preview
    const handleTogglePreview = () => {
        const newPreviewMode = !previewMode;
        setPreviewMode(newPreviewMode);

        if (newPreviewMode) {
            const link = createPreviewLink();
            onLinkPreview(link);
        } else {
            onLinkPreview(null);
        }
    };

    // Create link
    const handleCreateLink = () => {
        const link = createPreviewLink();
        if (link && duration > 0) {
            onLinkCreate(link);

            // Clear form
            setStartNodeId(null);
            setStartNodeName('');
            setStartNodeCoord(null);
            setEndNodeId(null);
            setEndNodeName('');
            setEndNodeCoord(null);
            setPathwayMode(null);
            setPathwayModeName('');
            setDuration(0);
            setDistance(0);
            setPreviewMode(false);
            onLinkPreview(null);

            // Clear crosshairs
            if (onNodeSelection) {
                onNodeSelection(null, null);
            }
        }
    };

    // Check if form is valid
    const isFormValid = startNodeId && endNodeId && pathwayMode !== null && duration > 0;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 mt-2">
                    <div className="alert alert-info" role="alert">
                        Select the start point of the edge
                    </div>
                    <Select
                        placeholder="Start point"
                        isSearchable
                        isClearable
                        value={startNodeId ? { label: startNodeName, value: startNodeId } : null}
                        options={nodeDropdown}
                        onChange={handleStartNodeChange}
                    />
                    <hr />

                    <div className="alert alert-info" role="alert">
                        Select pathway type
                    </div>
                    <Select
                        placeholder="Pathway type"
                        isSearchable
                        isClearable
                        value={pathwayMode !== null ? { label: pathwayModeName, value: pathwayMode } : null}
                        options={pathwayModeOptions}
                        onChange={handlePathwayModeChange}
                        isDisabled={!startNodeId}
                    />
                    <hr />

                    <div className="alert alert-info" role="alert">
                        Select the end point of the edge
                        {pathwayMode === PathwayModes.Walkway || pathwayMode === PathwayModes["Fare Gate"]
                            ? " (same level only)"
                            : pathwayMode !== null ? " (different level only)" : ""}
                    </div>
                    <Select
                        placeholder="End point"
                        isSearchable
                        isClearable
                        value={endNodeId ? { label: endNodeName, value: endNodeId } : null}
                        options={allowedEndNodes}
                        onChange={handleEndNodeChange}
                        isDisabled={!startNodeId || pathwayMode === null}
                    />
                    <hr />

                    <div className="alert alert-info" role="alert">
                        Travel duration (seconds)
                    </div>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Duration in seconds"
                        value={duration || ''}
                        onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
                    />
                    <hr />

                    <div className="alert alert-info" role="alert">
                        Distance (meters) - Optional
                    </div>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Distance in meters (auto-calculated if empty)"
                        value={distance || ''}
                        onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                    />
                    <hr />

                    <div className="row mt-2">
                        <div className="col-md-6">
                            {isFormValid && (
                                <button className="btn btn-secondary" onClick={handleTogglePreview}>
                                    {previewMode ? "End Preview" : "Preview Edge"}
                                </button>
                            )}
                        </div>
                        <div className="col-md-6">
                            {isFormValid && (
                                <button className="btn btn-primary" onClick={handleCreateLink}>
                                    Create Edge
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
