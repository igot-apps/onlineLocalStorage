const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Use the environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Path to store data
const dataFilePath = path.join(__dirname, 'localStorageData.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({}));
}

// Save localStorage data online
app.post('/save', (req, res) => {
    console.log("save");
    const { name, data } = req.body;
    if (!name || !data) {
        return res.status(400).json({ error: 'Name and data are required' });
    }

    const storedData = JSON.parse(fs.readFileSync(dataFilePath));
    storedData[name] = data;

    fs.writeFileSync(dataFilePath, JSON.stringify(storedData, null, 2));
    res.status(200).json({ message: `Data for ${name} saved successfully!` });
});

// Retrieve localStorage data
app.get('/retrieve/:name', (req, res) => {
    console.log("retrieve/:name");
    const { name } = req.params;
    const storedData = JSON.parse(fs.readFileSync(dataFilePath));

    if (!storedData[name]) {
        return res.status(404).json({ error: 'Data not found' });
    }

    res.status(200).json({ data: storedData[name] });
});

// View all saved data
app.get('/view-all', (req, res) => {
    console.log("view-all");
    const storedData = JSON.parse(fs.readFileSync(dataFilePath));
    res.status(200).json({ data: storedData });
});

// Delete specific data by key (name)
app.delete('/delete/:name', (req, res) => {
    console.log("delete/:name");
    const { name } = req.params;
    const storedData = JSON.parse(fs.readFileSync(dataFilePath));

    // Check if the data exists
    if (!storedData[name]) {
        return res.status(404).json({ error: `Data for ${name} not found` });
    }

    // Delete the specific data
    delete storedData[name];

    // Save the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(storedData, null, 2));

    res.status(200).json({ message: `Data for ${name} has been deleted successfully!` });
});

// Sell/Delete all saved data
app.delete('/sell-all', (req, res) => {
    console.log("delete-all");
    fs.writeFileSync(dataFilePath, JSON.stringify({}));  // Clear the data file
    res.status(200).json({ message: 'All saved data has been sold (deleted)!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
