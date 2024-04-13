import './App.css';
import React from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';
import TownshipSearch from './assets/components/TownshipSearch/TownshipSearch';
import MapComponent from './assets/components/MapComponent/MapComponent';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function App() {
	const [center, setCenter] = React.useState([37.8, -96]); // Default center of the US
    const [zoom, setZoom] = React.useState(4); // Default zoom level
    const [data, setData] = React.useState(); // Default zoom level
    const [error, setError] = React.useState(); // Default zoom level
	const [loading, setLoading] = React.useState(false);
	const [locationData, setLocationData] = React.useState([]);
	//const [pins, setPins] = React.useState([]);
	const [buildings, setBuildings] = React.useState([]);

	React.useEffect(() => {
        fetch('http://localhost:3001/api/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setData(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
            });
    }, []);

	async function fetchData(pins) {
		setLoading(true);
		const results = [];
		console.log(pins)
		for (const pin of pins) {
			// TBD
			// can be optimized to limit api calls by querying all pins at the same time using AND 
			const url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=PIN%20%3D%20'${pin}'&outFields=*&outSR=4326&f=json`;
			try {
				const response = await axios.get(url);
				console.log(response.data.features[0])
				if (response.data.features[0]) {
					results.push(response.data.features[0]);
				}
				//console.log(results[0].features[0]);
			} catch (error) {
				console.error(`Error fetching data for PIN: ${pin}`, error);
				results.push({ error: `Error fetching data for PIN: ${pin}` });
			}
		}
		setLocationData(results);
		setLoading(false);
	}

	function handleTownshipSearch(township) {
		// Assuming you have a function to fetch township data
		//const data = findTownshipData(township);
		if (data.length > 0) {
			console.log(data)
			const buildKeys = data.map((d) => d.KeyPIN)
				.map((b) => b.replaceAll('-', ''));

			// console.log(buildKeys)
			// setPins(buildKeys)
			fetchData(buildKeys);
			//console.log(buildKeys)
			// const { latitude, longitude } = data[0];
			// setCenter([latitude, longitude]);
			// setZoom(13); // Close-up view
		} else {
		  	alert("Township not found");
		}
	}

	return (
		<div>
            <TownshipSearch onSearch={handleTownshipSearch} />
			{loading ? <p>Loading</p> : <></>}
            <MapComponent center={center} zoom={zoom} locationData={locationData} assetData={data} />
        </div>
	);
}

export default App;
