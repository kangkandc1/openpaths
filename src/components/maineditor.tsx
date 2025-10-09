import { useEffect,useState,useContext } from "react";
import { useStationContext } from "../services/stationserviceprovider";
export const MainEditor: React.FC = () => {


    const { collection, addNode, getAllNodes, setStation, setStationModel,getAllEdges,getStationModel } = useStationContext();
    const [egdesGeojson,setEdgesGeojson]=useState(getAllEdges());
    const [nodesGeojson,setNodesGeojson]=useState(getAllNodes());
    

    console.log(getStationModel().label)

    return (
        <div>
            <h2>You are modelling {getStationModel().label}</h2>
            {/* Main editor content goes here */}
        </div>
    );
}