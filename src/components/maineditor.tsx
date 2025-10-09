import { useEffect,useState,useContext } from "react";
import { useStationContext } from "../services/stationserviceprovider";
export const MainEditor: React.FC = () => {


    const { collection, addNode, getAllNodes, setStation, setStationModel,getAllEdges,getStationModel } = useStationContext();

    console.log(getStationModel)

    return (
        <div>
            <h2>Main Editor Component</h2>
            {/* Main editor content goes here */}
        </div>
    );
}