const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const app = express();

app.use(cors()); // Use CORS to allow cross-origin access

// Endpoint to get spreadsheet data
app.get('/api/data', (req, res) => {
    const filePath = './test2Data.xlsx'; // Adjust the path as necessary
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
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
