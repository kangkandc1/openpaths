import { aachen } from "../../mockdata/aachen"
import { Schanz } from "../../mockdata/schanz"
import Select from "react-select";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import Icon from "react-icons-kit";
import { wrench } from 'react-icons-kit/icomoon/wrench'
import { plus } from "react-icons-kit/icomoon";
import { options } from "../../mockdata/fakeoptions"
import { useStationContext } from "../../services/stationserviceprovider";
import {useHistory} from "react-router-dom"
import { GeojsonEdgeCollection, GeojsonNodeCollection, StationModel, createEmptyEdgeCollection } from "../../interfaces/geometricalobjects";
export const LanndingPage = () => {
    const [selectedStation, setSelectedStation] = useState<string>(null);

    const [nodeCollection, setNodeCollection] = useState<GeojsonNodeCollection>(null);

    const [edegeCollection, setEdgeCollection] = useState<GeojsonEdgeCollection>(null);

    const [currentStationModel, setCurrentStationModel] = useState<StationModel>(null);

    const history=useHistory();

    const { setStationModel } = useStationContext();

    const handleStationChange = (e) => {
        setSelectedStation(e.value);
    }


    useEffect(() => {
        console.log("Selected station changed to ", selectedStation)
        if (selectedStation == "de:1") {
            setNodeCollection(aachen)
            setCurrentStationModel({ nodes: aachen, edges: createEmptyEdgeCollection(),label:"Aachen Hbf",id:"de:1" })
        } else if (selectedStation == "de:2") {
            setNodeCollection(Schanz)
            setCurrentStationModel({ nodes: Schanz, edges: createEmptyEdgeCollection(),label:"Aachen Schanz",id:"de:2" })
        }





    }, [selectedStation])


    useEffect(() => {
        console.log("Station model updated ", currentStationModel)
    }, [currentStationModel])


    const handleConfirmation = () => {
        console.log(currentStationModel)
        setStationModel(currentStationModel);
        history.push("/home")
    }

    return (
        <div className="container mt-5">
            <div className="col-md-8 offset-md-3">
                <div className="row mt-2 ">
                    <div className="col-md-4">

                        <Select
                            placeholder='Select Station'
                            isSearchable
                            value={selectedStation ? { "label": selectedStation, "value": selectedStation } : null}
                            options={options}
                            onChange={handleStationChange}
                        />

                    </div>

                    {selectedStation &&

                        <div className="offset-md-1">
                            <div className="row">
                            <div className="col-md-2 mt-2 mb-2">
                                <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center" data-tooltip-id="edit-tooltip" onClick={handleConfirmation}>
                                    <Icon icon={wrench} />
                                </button>
                                <Tooltip id="edit-tooltip" place="top" content="Bearbeiten" />
                            </div>
                        </div>
                        </div>

                    }
                </div>
            </div>

        </div>
    )
}