import { Point } from "mapbox-gl";
import { GeojsonNodeCollection, GeojsonPoint, PointGeometry } from "../../interfaces/geometricalobjects";
interface Centroid {
    lat:number,
    lon:number
}
export function findCenter(markers:PointGeometry[]) {
    let lat = 0;
    let lng = 0;
    
    for(let i = 0; i < markers.length; ++i) {
        lat += markers[i].coordinates[1];
        lng += markers[i].coordinates[0];
    }

    lat /= markers.length;
    lng /= markers.length;

    const centroid:Centroid={lat:lat,lon:lng}

    return centroid
}



export const getStationCentroid=(modelledPoints:GeojsonNodeCollection)=>{

    let markers: PointGeometry[] = []

    modelledPoints.features.map((e:GeojsonPoint)=>{
        markers.push(e.geometry)
    })

    const centroid=findCenter(markers)
    return centroid
}

