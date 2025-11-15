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

  saveModelToLocalStorage: () => void;

  clearModelFromLocalStorage: () => void;

  hasLocalStorageModel: () => boolean;
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

  const saveModelToLocalStorage = (): void => {
    service.saveToLocalStorage();
  }

  const clearModelFromLocalStorage = (): void => {
    const stationModel = service.getStationModel();
    if (stationModel?.id) {
      service.clearFromLocalStorage(stationModel.id);
      // Manually reset edges without calling setStationModel (to avoid loading from localStorage again)
      service.edgeCollection = { type: "FeatureCollection", Features: [] };
      setCollection({ ...service.getCollection() }); // trigger re-render
    }
  }

  const hasLocalStorageModel = (): boolean => {
    const stationModel = service.getStationModel();
    if (stationModel?.id) {
      return service.hasLocalStorageModel(stationModel.id);
    }
    return false;
  }

  return (
    <StationContext.Provider value={{
      collection,
      addNode,
      addEdge,
      getAllNodes,
      setStation,
      setStationModel,
      getAllEdges,
      getStationModel,
      saveModelToLocalStorage,
      clearModelFromLocalStorage,
      hasLocalStorageModel
    }}>
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
