import { NodeTypes } from "../interfaces/common";
import { GeojsonFeatureCollection, GeojsonNodeCollection } from "../interfaces/geometricalobjects";

export const aachen: GeojsonNodeCollection = {
    "type": "FeatureCollection",
    "Features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    6.083611130714416,
                    50.775278091430664
                ]
            },
            "properties": {
                "name": "generic_node_1",
                "id": "de:node1",
                "level":0,
                "category":NodeTypes.GENERIC
            },



        },

        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.091259,
                    50.767618
                ],
                "type": "Point"
            },
            "properties": {

                "name": "generic_node_2",
                "id": "de:node2",
                "level":0,
                "category":NodeTypes.GENERIC
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.091323,
                    50.767496
                ],
                "type": "Point"
            },
            "properties": {

                "name": "generic_node_3",
                "id": "de:node3",
                "level":0,
                "category":NodeTypes.GENERIC
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.090894,
                    50.767786
                ],
                "type": "Point"
            },
            "properties": {

                "name": "Gleis_2",
                "id": "de:node4",
                "level":1,
                "category":NodeTypes.PLATFORM
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.090817,
                    50.767722
                ],
                "type": "Point"
            },
            "properties": {

                "name": "Gleis_3",
                "id": "de:node5",
                "level":1,
                "category":NodeTypes.PLATFORM
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.090862,
                    50.767564
                ],
                "type": "Point"
            },
            "properties": {

                "name": "Gleis_4",
                "id": "de:node6",
                "level":1,
                "category":NodeTypes.PLATFORM
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.090948,
                    50.76752
                ],
                "type": "Point"
            },
            "properties": {

                "name": "Gleis_5",
                "id": "de:node7",
                "level":1,
                "category":NodeTypes.PLATFORM
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.090988,
                    50.76745
                ],
                "type": "Point"
            },
            "properties": {
                "name": "Gleis_6",
                "id": "de:node8",
                "level":1,
                "category":NodeTypes.PLATFORM
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.090969,
                    50.767389
                ],
                "type": "Point"

            },
            "properties": {
                "name": "Gleis_7",
                "id": "de:node9",
                "level":1,
                "category":NodeTypes.PLATFORM
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "coordinates": [
                    6.091045,
                    50.768205
                ],
                "type": "Point"
            },
            "properties": {

                "name": "main_entrance",
                "id": "de:node10",
                "level":0,
                "category":NodeTypes.ENTRANCE_EXIT
            }

        }





    ]
}
