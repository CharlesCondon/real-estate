import React from 'react'
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import customIconUrl from '../../images/placeholder.png';
import './MapComponent.css'

const customIcon = new L.Icon({
    iconUrl: customIconUrl,
    iconSize: [50, 50], // size of the icon
    iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    // className: 'iconCont' // Adding custom class name
});

function ZoomableMarker({ location, info, setAddress, setPin, setZoning, setValues, setZoneLink }) {
    const [zone, setZone] = React.useState('');
    const [popupOpen, setPopupOpen] = React.useState(false);
    const markerRef = React.useRef(null);
    const map = useMap();
    
    React.useEffect(() => {
        map.setView([location[0], location[1]], map.getZoom() < 13 ? 13 : map.getZoom());
    }, [location, map]);

    function getZoneLink(code) {
		const zoneUrls = {
			"R": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-48923",
			"B": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-49164",
			"C": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-49164",
			"D": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-49338",
			"M": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-49579",
			"PMD": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-50128",
			"PD": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-50128",
			"POS": "https://codelibrary.amlegal.com/codes/chicago/latest/chicagozoning_il/0-0-0-49648"
		};
		console.log(code)
		let prefix = code.charAt(0)
		console.log(prefix)

		if (prefix === 'P') {
			if (code.charAt(1) === "O") {
				return zoneUrls["POS"]
			} else {
				return zoneUrls["PD"]
			}
		}
		return zoneUrls[prefix]
	}
    
    //console.log(assetData)
    const handleClick = async () => {
        let addy = info.ADDRDELIV + ' ' + info.PLACENAME + ', ' + info.State + ' ' + info["Post_Code"];
        
        setAddress(addy)
        setPin(info.PIN)
        setZoning("")
        setValues("")
        try { // get zone class info
			const response = await axios.get(`https://data.cityofchicago.org/api/geospatial/dj47-wfun?lat=${location[0]}&lng=${location[1]}8&zoom=13`);
            
			if (response.data.length !== 0) {
				setZone(response.data[0]["zone_class"])
                setZoning(response.data[0]["zone_class"])
                let zoneLink = getZoneLink(response.data[0]["zone_class"]);
                setZoneLink(zoneLink)

			}
		} catch (error) {
			console.error(`Error fetching data `, error);
		}

        try { // get scraping info
            const response = await fetch(`http://localhost:3001/api/data/${info.PIN}`)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setValues(data);  // Ensure this is called correctly
        } catch (error) {
            console.error(`Error fetching data `, error);
        }

        // Set the map view to the marker's location with a higher zoom level
        //map.setView([location[0], location[1]], map.getZoom() < 13 ? 13 : map.getZoom());
        setPopupOpen(true);
        markerRef.current.openPopup();
    };

    const handleMouseLeave = () => {
        // Close the popup when mouse leaves
        markerRef.current.closePopup();
        setPopupOpen(false);
        
    };
  
    return (
        <Marker 
            position={[location[0], location[1]]}
            eventHandlers={{ click: handleClick, mouseleave: handleMouseLeave }}
            icon={customIcon}
            ref={markerRef}
        >
            {popupOpen && (<Popup>
                <p>ADDRESS: {info.ADDRDELIV}</p>
                <p>PIN: {info.PIN}</p>
                {zone ? <p>Zone Class: {zone}</p> : <></>}
                
            </Popup>)}
        </Marker>
    );
}

const MapComponent = ({ center, zoom, locationData, setAddress, setPin, setZoning, setValues, setZoneLink }) => {
    // const [map, setMap] = React.useState(null);
    // const [locations, setLocations] = React.useState();
    // const [data, setData] = React.useState([]);

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: window.innerHeight-120, width: '100%', zIndex:'0', boxShadow: "inset 20px 10px 25px -12px black" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locationData ? locationData.map((location, index) => (
                <ZoomableMarker key={index} location={[location.geometry.y, location.geometry.x]} info={location.attributes} setAddress={setAddress} setPin={setPin} setZoning={setZoning} setValues={setValues} setZoneLink={setZoneLink}/>                    
            )) : <></>}
        </MapContainer>
    );
};

export default MapComponent