import { PathwayModes } from "./common"

 export interface PointGeometry {
    "type": string
    "coordinates": [number, number]
}
 export interface GeojsonPoint {
    "type": string
    "geometry": PointGeometry
    "properties": {
        name:string
        id:string|number
        [key: string]: any  
    }
}

export interface LineGeometry {
    "type":string
    "coordinates":[number,number][]
    "properties":{
        name:string,
        id:string|number
        idStartPoint:string|number,
        idEndPoint:string|number,
        mode:PathwayModes,
        [key:string]:any
    }
}

export interface GeojsonLineString {
    "type": string
    "geometry": [number, number][]
    "properties": {

         name:string,
        id:string|number
        idStartPoint:string|number,
        idEndPoint:string|number,
        mode:PathwayModes,
        [key:string]:any
        }
}

export type GeojsonFeature = GeojsonPoint | GeojsonLineString





export interface GeojsonFeatureCollection {
    "type": string
    "Features": GeojsonPoint[] | GeojsonLineString[]
}


export interface GeojsonNodeCollection {
    "type": string,
    "Features": GeojsonPoint[]
}


export const createEmptyEdgeCollection=():GeojsonEdgeCollection=>{
    return {
        "type": "FeatureCollection",
        "Features": []
    }
}


export interface GeojsonEdgeCollection {
    "type": string,
    "Features": GeojsonLineString[]
}


export interface StationModel {
    nodes:GeojsonNodeCollection,
    edges:GeojsonEdgeCollection
}