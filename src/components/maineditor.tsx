import { useEffect, useState, useContext } from "react";
import { useStationContext } from "../services/stationserviceprovider";
import { getStationCentroid } from "./utilities/geospatialutilities";
import { assignColorToLevel } from "./utilities/mapdisplayutilities";
import { GeojsonPoint, GeojsonNodeCollection } from "../interfaces/geometricalobjects";
import { RotatingLines } from "react-loader-spinner"
import { MapComponent } from "./mapcomponent";
export const MainEditor: React.FC = () => {


    const { collection, addNode, getAllNodes, setStation, setStationModel, getAllEdges, getStationModel } = useStationContext();
    const [egdesGeojson, setEdgesGeojson] = useState(getAllEdges());
    const [nodesGeojson, setNodesGeojson] = useState(getAllNodes());
    const [stationCentroid, setStationCentroid] = useState();
    const [loading, setLoading] = useState(true);

    console.log(getStationCentroid(getStationModel().nodes))

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 2000); // 2 seconds
        return () => clearTimeout(t);
    }, []);

    const coloredNodes = { "type": "FeatureCollection", "features": [] as GeojsonPoint[] };

    getStationModel().nodes.features.forEach((node) => {
        const level = node.properties.level;
        const color = assignColorToLevel(level);
        const coloredNode = {
            ...node,
            properties: {
                ...node.properties,
                displayColor: color
            }
        };
        coloredNodes.features.push(coloredNode);
    });




    const coloredNodesGeojson: GeojsonNodeCollection = {
        type: "FeatureCollection",
        features: coloredNodes.features,
    };

    const centroid = getStationCentroid(getStationModel().nodes);


    const currentMapProps = {
        coloredNodes: coloredNodesGeojson,
        centroid: [centroid.lon, centroid.lat]
    }

    return (
        <div className="container-fluid">
            <div className="row-mt-2">
                <div className="col-md-12">
                    <h2>You are modelling {getStationModel().label}</h2>
                </div>
            </div>

            <div className="row-mt-2">
                <div className="col-md-12">
                    {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="96"
                        visible={true}
                    />
                </div>
            ) : <MapComponent coloredNodes={coloredNodesGeojson}
                centroid={[centroid.lon, centroid.lat]} />}
                </div>
                
            </div>

            
            {/* Main editor content goes here */}
        </div>
    );
}