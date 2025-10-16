import { useEffect, useState, useContext } from "react";
import { useStationContext } from "../services/stationserviceprovider";
import { getStationCentroid } from "./utilities/geospatialutilities";
import { assignColorToLevel } from "./utilities/mapdisplayutilities";
import { GeojsonPoint } from "../interfaces/geometricalobjects";
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

    getStationModel().nodes.Features.forEach((node) => {
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

    console.log(coloredNodes);

    return (
        <div className="container-fluid">
            <div className="row-mt-2">
                <div className="col-md-4">
                    <h2>You are modelling {getStationModel().label}</h2>
                </div>
            </div>

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
            ) : <MapComponent />}
            {/* Main editor content goes here */}
        </div>
    );
}