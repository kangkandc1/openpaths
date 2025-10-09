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


    setStation(nodeCollection:GeojsonNodeCollection){
        this.nodeCollection=nodeCollection;
        this.edgeCollection={type:"FeatureCollection",Features:[]}

    }


    setStationModel(stationModel:StationModel){
        this.nodeCollection=stationModel.nodes;
        this.edgeCollection=stationModel.edges;
        this.stationModel=stationModel;

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
        return {nodes:this.nodeCollection,edges:this.edgeCollection,label:this.stationModel?.label,id:this.stationModel?.id}
    }


    getNodeById(id:IdType):Optional<GeojsonPoint>{
       const searchedNode=this.nodeCollection.Features.filter((node:GeojsonPoint)=>{
            return node.properties.id==id
        })

        if(searchedNode.length>0){
            return Optional.of(searchedNode[0])

        }else {
            return Optional.empty()
        }


        

    




    }




    removeNodeById(id:string|number):void{
        this.nodeCollection.Features=this.nodeCollection.Features.filter((node:GeojsonPoint)=>{
            return node.properties.id!==id
        })

    }

    removeEdgeById(id:string|number):void{
        this.edgeCollection.Features=this.edgeCollection.Features.filter((edge)=>{
            return edge.properties.id!==id
        })

    }

    addNode(node:GeojsonPoint):void{
        this.nodeCollection.Features.push(node)
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
