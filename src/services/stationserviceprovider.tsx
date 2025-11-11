import React, { createContext, useContext, useState } from "react";
import { GeojsonPoint, GeojsonNodeCollection,StationModel, GeojsonEdgeCollection, GeojsonLineString } from "../interfaces/geometricalobjects";
import {StationService} from "./stationmodelservice"
import { aachen } from "../mockdata/aachen";

const service = new StationService(aachen);

interface StationContextValue {
  collection: GeojsonNodeCollection;
  addNode: (node: GeojsonPoint) => void;
  addEdge: (edge: GeojsonLineString) => void;

  getAllNodes: () => GeojsonNodeCollection;

  setStation:(statioNode:GeojsonNodeCollection)=>void;

  setStationModel:(stationModel:StationModel)=>void;

  getAllEdges:()=>GeojsonEdgeCollection;

  getStationModel:()=>StationModel;
}

const StationContext = createContext<StationContextValue | undefined>(undefined);

export const StationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 
  const [collection, setCollection] = useState(service.getCollection());

  const addNode = (node: GeojsonPoint): void => {
    service.addNode(node);
    setCollection({ ...service.getCollection() }); // trigger re-render
  };

  const addEdge = (edge: GeojsonLineString): void => {
    service.addEdge(edge);
    setCollection({ ...service.getCollection() }); // trigger re-render
  };

  const getAllNodes = (): GeojsonNodeCollection => {
    return service.getCollection();
  };

  const setStation = (stationData: GeojsonNodeCollection): void => {
    service.setStation(stationData);
    //setCollection({ ...service.getCollection() });
  };

  const setStationModel = (stationModel: StationModel): void => {
    service.setStationModel(stationModel);
    //setCollection({ ...service.getCollection() });
  };



  const getAllEdges = (): GeojsonEdgeCollection => {
    return service.getAllEdges();
  }


  const getStationModel = (): StationModel => {
    return service.getStationModel();
  }

  return (
    <StationContext.Provider value={{ collection, addNode, addEdge, getAllNodes, setStation, setStationModel, getAllEdges, getStationModel }}>
      {children}
    </StationContext.Provider>
  );
};

export const useStationContext = (): StationContextValue => {
  const ctx = useContext(StationContext);
  if (!ctx) {
    throw new Error("useGeojson must be used inside GeojsonProvider");
  }
  return ctx;
};
