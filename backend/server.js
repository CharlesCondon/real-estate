const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const app = express();

const proj4 = require('proj4');
// Define the two coordinate systems
const wgs84 = 'EPSG:4326';
const nad83IllinoisEast = '+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.999975 +x_0=299999.9998983998 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=us-ft +no_defs';

// Coordinates in WGS 84
const long = -87.75005790570935;
const lat = 41.85880068292314;

// Convert to NAD83 / Illinois East
const convertedCoords = proj4(wgs84, nad83IllinoisEast, [long, lat]);
console.log(convertedCoords); // This will give you the new x, y in the Illinois East system


app.use(cors()); // Use CORS to allow cross-origin access

// Endpoint to get spreadsheet data
app.get('/api/data', (req, res) => {
    const filePath = './test3Data.xlsx'; // Adjust the path as necessary
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[7];
        console.log(sheetName)
        const worksheet = workbook.Sheets[sheetName];
        //console.log(worksheet)
        const data = XLSX.utils.sheet_to_json(worksheet);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to read the spreadsheet", error });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
