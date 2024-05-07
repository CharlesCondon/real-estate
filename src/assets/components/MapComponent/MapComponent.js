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


        // const x1 = -87.80788421630861;
        // const y1 = 41.79038482309324;
        // const x2 = -87.59227752685548;
        // const y2 = 41.90955923001296;
    
        // const bounds = [[y1, x1], [y2, x2]];
        // //console.log(bounds)
  
        // L.rectangle(bounds, { color: '#ff7800', weight: 1 }).addTo(map);
      
      
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

function ZoomableMarker({ location, info, assetData, setAddress, setPin, setZoning, setValues }) {
    const [zone, setZone] = React.useState('');
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [data, setData] = React.useState();
    const [error, setError] = React.useState();
    const markerRef = React.useRef(null);
    let z = ""
    const map = useMap();
    
    React.useEffect(() => {
        map.setView([location[0], location[1]], map.getZoom() < 13 ? 13 : map.getZoom());
    }, [location, map]);
    
    //console.log(assetData)
    const handleClick = async () => {
        setAddress(info.ADDRDELIV)
        setPin(info.PIN)
        setZoning("")
        setValues()
        try {
			const response = await axios.get(`https://data.cityofchicago.org/api/geospatial/dj47-wfun?lat=${location[0]}&lng=${location[1]}8&zoom=13`);

			if (response.data) {
                //console.log(response.data[0])
				setZone(response.data[0]["zone_class"])
                setZoning(response.data[0]["zone_class"])
				//results.push(response.data.features);
			}
			//console.log(results[0].features[0]);
		} catch (error) {
			console.error(`Error fetching data `, error);
		}

        try {
            fetch(`http://localhost:3001/api/data/${info.PIN}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    //console.log(response.json())
                    return response.json();
            })
            .then(data => setValues(data))
            .then(data => console.log(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
            });
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
                {/* <p>SQFT: {footage}</p>
                <p>Value: {value}</p> */}
                {/* <p>PROPERTY USE: {assetData["Property Use"]}</p> */}
                {zone ? <p>Zone Class: {zone}</p> : <></>}
                
            </Popup>)}
        </Marker>
    );
}

const MapComponent = ({ center, zoom, locationData, assetData, setAddress, setPin, setZoning, setValues }) => {
    const [map, setMap] = React.useState(null);
    const [locations, setLocations] = React.useState();
    const [data, setData] = React.useState([]);

    //console.log(locationData)

    //-87.80788421630861,41.79038482309324,-87.59227752685548,41.90955923001296
    //41.79038482309324,-87.80788421630861,41.90955923001296,-87.59227752685548

    // Custom hook to detect map movement
    function MapMovementHandler() {
        const map = useMap();
        React.useEffect(() => {
            const handleMove = () => {
                const bounds = map.getBounds();
                //console.log(bounds);
                //fetchData(bounds);
            };
            map.on('moveend', handleMove);
            return () => {
                map.off('moveend', handleMove);
            };
        }, [map], data);
        return null;
    }

    // Fetch data from API based on map bounds
    // const fetchData = async (bounds) => {
    //     const { _northEast, _southWest } = bounds;
    //     const { lat: ymin, lng: xmin } = _southWest;
    //     const { lat: ymax, lng: xmax } = _northEast;
    //     console.log( xmin + ',' + ymin + "," + xmax + "," + ymax)
    //     // console.log( ymin)
    //     // console.log( xmax)
    //     // console.log( ymax)
    //     //const url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=1%3D1&geometryType=esriGeometryEnvelope&geometry=${xmin}%2C${ymin}%2C${xmax}%2C${ymax}&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=json`;
    //     const url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=1%3D1&outFields=*&geometry=${ymin}%2C${xmin}%2C${ymax}%2C${xmax}&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelWithin&outSR=4326&f=json`;
    //     console.log(url)
    //     //const url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=&outFields=*&outSR=4326&f=json&bbox=${_southWest.lng},${_southWest.lat},${_northEast.lng},${_northEast.lat}`;
        
    //     try {
    //         const response = await fetch(url);
    //         const responseData = await response.json();
    //         console.log(responseData.features)
    //         setData(responseData.features);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: window.innerHeight-120, width: '100%' }}>
            <MapMovementHandler />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <UpdateMapCenter center={center} zoom={zoom} />
            {locationData ? locationData.map((location, index) => (
                <ZoomableMarker key={index} location={[location.geometry.y, location.geometry.x]} info={location.attributes} assetData={assetData[index]} setAddress={setAddress} setPin={setPin} setZoning={setZoning} setValues={setValues}/>                    
            )) : <></>}
        </MapContainer>
    );
};

export default MapComponent