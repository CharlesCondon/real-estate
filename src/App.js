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
				//console.log(response.json())
                return response.json();
            })
            .then(data => setData(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
            });
    }, []);
	//let counter = 0;
	async function fetchData(pins) {
		setLoading(true);
		const results = [];
		
		const temp = pins.slice(0, pins.length/4);
		console.log(temp)
		let url = 'https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
		//let inputPins = '';

		// if (temp.length === 1) {
		// 	url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=PIN%20%3D%20'${pins[0]}'&outFields=*&outSR=4326&f=json`;
		// } else {
		// 	inputPins = temp.join("'%20AND%20PIN%20%3D%20'");
		// 	url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=PIN%20%3D%20'${inputPins}'&outFields=*&outSR=4326&f=json`;
		// 	console.log(url)
		// }
		//console.log(inputPins)

		try {
			const response = await axios.get(url);
			console.log(response.data.features)
			if (response.data.features) {
				setLocationData(response.data.features)
				//results.push(response.data.features);
			}
			//console.log(results[0].features[0]);
		} catch (error) {
			console.error(`Error fetching data `, error);
			results.push({ error: `Error fetching data` });
		}
		
		// for (const pin of pins) {
		// 	if (counter > 100) {
		// 		break;
		// 	}
		// 	// TBD
		// 	// can be optimized to limit api calls by querying all pins at the same time using AND 
		// 	url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=PIN%20%3D%20'${pin}'&outFields=*&outSR=4326&f=json`;
			
		// 	counter++;
		// }
		//setLocationData(results);
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
