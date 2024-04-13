import React from 'react'
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import customIconUrl from '../../images/placeholder.png';
import './MapComponent.css'

const UpdateMapCenter = ({ center, zoom }) => {
    const map = useMap();
  
    React.useEffect(() => {
      if (center) map.flyTo(center, zoom);
      
    }, [center, zoom, map]);
  
    return null;
};

const customIcon = new L.Icon({
    iconUrl: customIconUrl,
    iconSize: [50, 50], // size of the icon
    iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    // className: 'iconCont' // Adding custom class name
});

function ZoomableMarker({ location, info, assetData }) {
    const map = useMap();
    //console.log(assetData)
    const handleClick = () => {
        // Set the map view to the marker's location with a higher zoom level
        map.setView([location[0], location[1]], map.getZoom() < 16 ? 16 : map.getZoom());
    };

    const num = Math.floor(assetData["Market Value"]);
    const value = "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const footage = assetData.BldgSqft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return (
        <Marker 
            position={[location[0], location[1]]}
            eventHandlers={{ click: handleClick }}
            icon={customIcon}
        >
            <Popup>
                <p>ADDRESS: {info.ADDRDELIV}</p>
                <p>PIN: {assetData.KeyPIN}</p>
                <p>SQFT: {footage}</p>
                <p>Value: {value}</p>
                <p>PROPERTY USE: {assetData["Property Use"]}</p>
            </Popup>
        </Marker>
    );
}

const MapComponent = ({ center, zoom, locationData, assetData }) => {
    const [map, setMap] = React.useState(null);
    const [locations, setLocations] = React.useState();
    console.log(locationData)

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <UpdateMapCenter center={center} zoom={zoom} />
            {locationData.map((location, index) => (
                <ZoomableMarker key={index} location={[location.geometry.y, location.geometry.x]} info={location.attributes} assetData={assetData[index]}/>                    
            ))}
        </MapContainer>
    );
};

export default MapComponent