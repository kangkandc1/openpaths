import { NodeTypes } from "../interfaces/common";
import { GeojsonNodeCollection } from "../interfaces/geometricalobjects";

export const Schanz:GeojsonNodeCollection={
    
  "type": "FeatureCollection",
  "Features": [
   
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.073865,
          50.769403
        ],
        "type": "Point"
      },
      "properties": {
       
        "name": "Generic_node 1",
        "id":"de:generic_1",
        "level":1,
        "category":NodeTypes.GENERIC
      },
      
    },
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.07398,
          50.769427
        ],
        "type": "Point"
      },
      "properties": {
        
        "name": "generic_node_2",
        "id":"de:generic_2",
        "level":1,
        "category":NodeTypes.GENERIC
      },
     
    },
    
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.073535,
          50.770056
        ],
        "type": "Point"
      },
      "properties": {
        
        "name": "gleis 1",
        "id":"de_generic3",
        "level":1,
        "category":NodeTypes.GENERIC
      }
     
    },
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.073701,
          50.770093
        ],
        "type": "Point"
      },
      "properties": {
       
        "description": "Gleis 2",
        "name": "Gleis 2",
        "id":"de_generic4",
        "level":1,
        "category":NodeTypes.PLATFORM
      }
      
    },
    
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.073768,
          50.769245
        ],
        "type": "Point"
      },
      "properties": {
       
        "name": "Eingang Lütticher Str Süd",
        "id":"de_generic5",
        "level":2,
        "category":NodeTypes.ENTRANCE_EXIT
      }
      
    },
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.074278,
          50.769413
        ],
        "type": "Point"
      },
      "properties": {
        
        "name": "Einganz Lütticherstr Nord",
        "id":"de_generic6",
        "level":2,
        "category":NodeTypes.ENTRANCE_EXIT
      }
     
    },
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.073288,
          50.770628
        ],
        "type": "Point"
      },
      "properties": {
        
        "name": "Eingang Jakob Straße 1",
        "id":"de:generic7",
        "level":0,
        "category":NodeTypes.ENTRANCE_EXIT
      }
      
    },
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
          6.073546,
          50.770702
        ],
        "type": "Point"
      },
      "properties": {
        
        "name": "Eingang_Jakob_str_1",
        "id":"de_generic8",
        "level":0,
        "category":NodeTypes.ENTRANCE_EXIT
      }
    
    }
    
  ]
}
