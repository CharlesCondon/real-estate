import './App.css';
import React from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';
import TownshipSearch from './assets/components/TownshipSearch/TownshipSearch';
import MapComponent from './assets/components/MapComponent/MapComponent';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Navbar from './assets/components/Navbar/Navbar';

function App() {
	const [center, setCenter] = React.useState([41.85, -87.7]); // Default center of the US
    const [zoom, setZoom] = React.useState(13); // Default zoom level
    const [data, setData] = React.useState(); // Default zoom level
    const [error, setError] = React.useState(); // Default zoom level
	const [loading, setLoading] = React.useState(false);
	const [locationData, setLocationData] = React.useState([]);
	const [address, setAddress] = React.useState("");
	const [pin, setPin] = React.useState("");
	const [zone, setZoning] = React.useState("");
	const [values, setValues] = React.useState();
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

				let temp = response.data.features;
				temp = temp.map((t) => t.attributes.PIN)
				console.log(temp)
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

	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	return (
		<div className='app'>
			<Navbar/>
			<div className='mapCont'>
				<div className='infoCont'>
					<TownshipSearch onSearch={handleTownshipSearch} />
					{loading ? <p>Loading</p> : <></>}
					<div className='buildingInfo'>
						{address && (
							<h3>Address: {address}</h3>
						)}
						{pin && (
							<h3>PIN: {pin}</h3>
						)}
						{zone && (
							<h3>Zone: {zone}</h3>
						)}
						{values && (
							<div>
								<h3>Value: {USDollar.format(values.value)}</h3>
								<div>
									<p>Tax History</p>
									<p>2023: {values["2023"]}</p>
									<p>2022: {USDollar.format(values["2022"])}</p>
									<p>2021: {USDollar.format(values["2021"])}</p>
									<p>2020: {USDollar.format(values["2020"])}</p>
									<p>2019: {USDollar.format(values["2019"])}</p>
									<p>2018: {USDollar.format(values["2018"])}</p>
								</div>
							</div>
						)}
					</div>	
				</div>
				<MapComponent center={center} zoom={zoom} locationData={locationData} assetData={data} setAddress={setAddress} setPin={setPin} setZoning={setZoning} setValues={setValues} />
			</div>
        </div>
	);
}

export default App;
