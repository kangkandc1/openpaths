import { IdType, PathwayModes } from "../interfaces/common";
import { GeojsonPoint, GeojsonNodeCollection,GeojsonEdgeCollection, GeojsonLineString,StationModel } from "../interfaces/geometricalobjects";
import Optional from "../interfaces/customoptional";
export class StationService {
    nodeCollection:GeojsonNodeCollection;

    edgeCollection:GeojsonEdgeCollection;

    stationId:IdType;

    stationModel:StationModel;

    constructor(nodeCollection:GeojsonNodeCollection){
        this.nodeCollection=nodeCollection
        this.edgeCollection={type:"FeatureCollection",Features:[]}
    }

    /**
     * Generates a local storage key for a station model
     */
    private getStorageKey(stationId: string | number): string {
        return `station_model_${stationId}`;
    }

    /**
     * Saves the current station model to local storage
     */
    saveToLocalStorage(): void {
        if (!this.stationModel?.id) {
            console.error("Cannot save: Station model ID is not set", this.stationModel);
            return;
        }

        const key = this.getStorageKey(this.stationModel.id);
        const modelData = {
            nodes: this.nodeCollection,
            edges: this.edgeCollection,
            label: this.stationModel.label,
            id: this.stationModel.id,
            savedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(key, JSON.stringify(modelData));
            console.log(`Station model saved to local storage: ${key}`, `Edges: ${this.edgeCollection.Features.length}`);
        } catch (error) {
            console.error("Error saving to local storage:", error);
        }
    }

    /**
     * Loads a station model from local storage if available
     * Returns true if model was loaded, false otherwise
     */
    loadFromLocalStorage(stationId: string | number): boolean {
        const key = this.getStorageKey(stationId);

        try {
            const savedData = localStorage.getItem(key);

            if (savedData) {
                const modelData = JSON.parse(savedData);
                this.nodeCollection = modelData.nodes;
                this.edgeCollection = modelData.edges;
                this.stationModel = {
                    nodes: modelData.nodes,
                    edges: modelData.edges,
                    label: modelData.label,
                    id: modelData.id
                };
                console.log(`Station model loaded from local storage: ${key}`, modelData.savedAt);
                return true;
            }
        } catch (error) {
            console.error("Error loading from local storage:", error);
        }

        return false;
    }

    /**
     * Clears the station model from local storage
     */
    clearFromLocalStorage(stationId: string | number): void {
        const key = this.getStorageKey(stationId);

        try {
            localStorage.removeItem(key);
            console.log(`Station model cleared from local storage: ${key}`);
        } catch (error) {
            console.error("Error clearing from local storage:", error);
        }
    }

    /**
     * Checks if a saved model exists in local storage
     */
    hasLocalStorageModel(stationId: string | number): boolean {
        const key = this.getStorageKey(stationId);
        return localStorage.getItem(key) !== null;
    }


    setStation(nodeCollection:GeojsonNodeCollection){
        this.nodeCollection=nodeCollection;
        this.edgeCollection={type:"FeatureCollection",Features:[]}

    }


    setStationModel(stationModel:StationModel){
        // Try to load from local storage first
        const loaded = this.loadFromLocalStorage(stationModel.id);

        if (loaded) {
            console.log("Loaded existing model from local storage for station:", stationModel.id);
        } else {
            // Use the provided station model if nothing in local storage
            this.nodeCollection=stationModel.nodes;
            this.edgeCollection=stationModel.edges;
            this.stationModel=stationModel;
            console.log("Using fresh station model for station:", stationModel.id);
        }
    }

    setStationId(stationId:IdType){
        this.stationId=stationId;
    }

    getCollection():GeojsonNodeCollection{
        return this.nodeCollection
    }


    getAllEdges():GeojsonEdgeCollection{
        return this.edgeCollection
    }

    getStationModel():StationModel{
        // Ensure we return the complete model
        if (!this.stationModel) {
            console.warn("Station model is not initialized properly");
            return {
                nodes: this.nodeCollection,
                edges: this.edgeCollection,
                label: undefined,
                id: undefined
            };
        }
        return this.stationModel;
    }


    getNodeById(id:IdType):Optional<GeojsonPoint>{
       const searchedNode=this.nodeCollection.features.filter((node:GeojsonPoint)=>{
            return node.properties.id==id
        })

        if(searchedNode.length>0){
            return Optional.of(searchedNode[0])

        }else {
            return Optional.empty()
        }


        

    




    }




    removeNodeById(id:string|number):void{
        this.nodeCollection.features=this.nodeCollection.features.filter((node:GeojsonPoint)=>{
            return node.properties.id!==id
        })

    }

    removeEdgeById(id:string|number):void{
        this.edgeCollection.Features=this.edgeCollection.Features.filter((edge)=>{
            return edge.properties.id!==id
        })

    }

    addNode(node:GeojsonPoint):void{
        this.nodeCollection.features.push(node)
    }

    addEdge(edge:GeojsonLineString):void{
        this.edgeCollection.Features.push(edge)
    }


    createEdge(name:string,id:IdType,idStartPoint:IdType,idEndPoint:IdType,mode:PathwayModes,duration:number,distance?:number){

        const startNode:GeojsonPoint=this.getNodeById(idStartPoint).get()

        const endNode:GeojsonPoint=this.getNodeById(idEndPoint).get();


        let requestedLink:GeojsonLineString={
            type:"Feature",
            geometry:[startNode.geometry.coordinates,endNode.geometry.coordinates],
            properties:{
                "name":name,
                "id":id,
                "idEndPoint":idEndPoint,
                "idStartPoint":idStartPoint,
                "mode":mode,
                "duration":duration,
                "distance":distance

            }

        }


        this.addEdge(requestedLink);
        
        
    }
}       
