import './App.css';
import React from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';
import TownshipSearch from './assets/components/TownshipSearch/TownshipSearch';
import MapComponent from './assets/components/MapComponent/MapComponent';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Navbar from './assets/components/Navbar/Navbar';
import Footer from './assets/components/Footer/Footer';

function App() {
	const [center, setCenter] = React.useState([41.85, -87.7]); // Default center of the US
    const [zoom, setZoom] = React.useState(13); // Default zoom level
    const [data, setData] = React.useState(); // Default zoom level
	const [loading, setLoading] = React.useState(false);
	const [locationData, setLocationData] = React.useState([]);
	const [address, setAddress] = React.useState("");
	const [pin, setPin] = React.useState("");
	const [zone, setZoning] = React.useState("");
	const [values, setValues] = React.useState();
	const [zoneLink, setZoneLink] = React.useState("");

	// React.useEffect(() => {
    //     console.log('Values updated:', data);
    // }, [data]);

	//let counter = 0;
	async function fetchData(userInput, inputType) {
		setLoading(true);
		
		let url;
		if (inputType === 0) {
			let str = userInput;
			if (str.toString().length < 14) {
				str = '0' + userInput.toString();
			}

			url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=PIN%20%3D%20'${str}'&outFields=*&outSR=4326&f=json`
		} else {
			let str = '';
			for (let i = 0; i < userInput.length; i++) {
				if (i === userInput.length) {
					str += userInput[i]
				}
				str += (userInput[i] + '%20')
			}
			console.log(str)
			url = `https://gis.cookcountyil.gov/traditional/rest/services/addressZipCode/MapServer/0/query?where=ADDRDELIV%20%3D%20'${str}'&outFields=*&outSR=4326&f=json`
		}
		

		try {
			const response = await axios.get(url);
			console.log(response.data.features)
			if (response.data.features) {
				setLocationData(response.data.features)

				let temp = response.data.features;
				temp = temp.map((t) => t.attributes.PIN)
				console.log(temp)
			}
		} catch (error) {
			console.error(`Error fetching data `, error);
		}
		
		setLoading(false);
	}

	function handleTownshipSearch(township) {
		if (township.length > 0) {
			let userInput = township.toString().toUpperCase();
			let userArr = userInput.split(" ");
			let inputType;

			if (userArr.length > 1) {
				inputType = 1
				fetchData(userArr, inputType);
			} else {
				inputType = 0;
				fetchData(userInput, inputType);
			}
		} else {
		  	alert("Township not found");
		}
	}

	

	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumSignificantDigits: 3,
	});

	return (
		<div className='app'>
			<Navbar/>
			<div className='mapCont'>
				<div className='infoCont'>
					<TownshipSearch onSearch={handleTownshipSearch} />
					{loading ? <p>Loading</p> : <></>}
					{!loading && address ? 
					
					<div className='buildingInfo'>
						{address && (
							<div>
								<h2>Address:</h2>
								<h3>{address}</h3>
							</div>
						)}
						<hr></hr>
						{pin && (
							<div>
								<h2>PIN:</h2>
								<h3>{pin}</h3>
							</div>
						)}
						<hr></hr>
						{zone && (
							<>
								<div>
									<h2>Zoning Code:</h2>
									<h3>{zone}</h3>
									<a href={zoneLink} target='_blank' rel='noreferrer'>Learn More {'>'}</a>
								</div>
								<hr></hr>
							</>
						)}
						
						{values["2023 market"] ? (
							<div>
								<table>
									<tbody>
										<tr>
											<td>&nbsp;</td>
											<td>2023 Board of Review Certified</td>
											<td>2022 Board of Review Certified</td>
										</tr>
										<tr>
											<td>Total Estimated Market Value</td>
											<td>{USDollar.format(values["2023 market"])}</td>
											<td>{USDollar.format(values["2022 market"])}</td>
										</tr>
										<tr>
											<td>Total Assessed Value</td>
											<td>{USDollar.format(values["2023 assessed"])}</td>
											<td>{USDollar.format(values["2022 assessed"])}</td>
										</tr>
									</tbody>
								</table>
							</div>
						) : <div>
								<h2><a href={`https://www.cookcountyassessor.com/pin/${pin}`} target='_blank' rel='noreferrer'>Assessor Data</a></h2>
								<hr></hr>
							</div>}
						
						{values && (
							<div>
								{/* <h3>Value: {USDollar.format(values.value)}</h3> */}
								<div>
									<h2>Tax Bills & History</h2>
									<div>
										<h3>2023:</h3>
										<a href={values["2023 taxbill"]} target='_blank' rel="noreferrer">Tax Year 2023 First Installment</a>
									</div>
									<div>
										<h3>2022:</h3>
										<a href={values["2022 taxbill"]} target='_blank' rel="noreferrer">Tax Year 2022 Second Installment</a>
									</div>
								</div>
							</div>
						)}
					</div> : <></> }	
				</div>
				<MapComponent center={center} zoom={zoom} locationData={locationData} assetData={data} setAddress={setAddress} setPin={setPin} setZoning={setZoning} setValues={setValues} setZoneLink={setZoneLink} />
			</div>
			<Footer/>
        </div>
	);
}

export default App;
