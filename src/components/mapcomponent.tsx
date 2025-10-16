import { useState,useEffect,useContext } from "react"
import ReactMapGL, { Source, Layer, NavigationControl, Popup, Marker } from 'react-map-gl';

const flexibleCircleLayer = {
    id: 'flexible-circle',
    type: 'circle',

    paint: {
        'circle-radius': 4,
        'circle-color': ["get", "displayColor"]
    }
}

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2FuZ2thbmRldiIsImEiOiJjbHgwMmQzbHgwZTg4MnFzZTRsb3d1M2JiIn0.yEH3HF9v9Qdm849tyvMq8Q';

export const MapComponent=()=>{
    return <div>Map Component</div>
}