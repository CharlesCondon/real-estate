const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const app = express();

app.use(cors()); // Use CORS to allow cross-origin access

// Endpoint to get spreadsheet data
// app.get('/api/data', (req, res) => {
//     const filePath = './test3Data.xlsx'; // Adjust the path as necessary
//     try {
//         const workbook = XLSX.readFile(filePath);
//         const sheetName = workbook.SheetNames[7];
//         //console.log(sheetName)
//         const worksheet = workbook.Sheets[sheetName];
//         const data = XLSX.utils.sheet_to_json(worksheet);
//         //console.log(data)
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to read the spreadsheet", error });
//     }
// });

app.get('/api/data/:pin', (req, res) => {
    const pin = req.params.pin;
    console.log(pin)

    const filePath = './scrapeData.xlsx'; // Adjust the path as necessary
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        //console.log(sheetName)
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        //console.log(data)
        const result = data.filter((p) => p.pin.toString() === pin)
        console.log(result)
        if (result.length === 0) {
            res.status(400).json({ message: "Info not found in database."});
        }
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Failed to read the spreadsheet", error });
    }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
