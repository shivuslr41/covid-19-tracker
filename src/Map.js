import React from 'react'
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet"
import "./Map.css"
import { showDataOnMap } from "./util"

function ChangeMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom)
    map.setMaxZoom(10)
    return null
}

function MapContainer({ countries, casesType, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap>
                <ChangeMap center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default MapContainer
