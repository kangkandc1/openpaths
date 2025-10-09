export enum PathwayModes {
    "Walkway" = 1,
    "Stairs" = 2,
    "Moving sidewalk/travelator" = 3,
    "Escalator" = 4,
    "Elevator" = 5,
    "Fare Gate" = 6,
    "Ramp"=7

}

export interface PathwayLink{
    id:string|number
    isBirectional: boolean
    idStartPoint:string|number
    idEndPoint:string|number
    duration:number
    distance?:number

    pathwayType:PathwayModes
    
    
    


}


export type IdType=string