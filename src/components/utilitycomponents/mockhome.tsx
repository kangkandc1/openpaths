import { useStationContext } from "../../services/stationserviceprovider"

export const MockHome = () => {

    const { getAllNodes, addNode,setStation, setStationModel,getStationModel } = useStationContext();

    console.log(getStationModel())


    return (
        <div className="container">
            <div> This is the home page</div><div> This is the home page</div><div> This is the home page</div><div> This is the home page</div><div> This is the home page</div>
        </div>
    )
}       