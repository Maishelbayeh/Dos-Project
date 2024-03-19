const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3005;

app.use(express.json());
app.use(cors());

// Define the path to the data file
const dataFilePath = path.resolve(__dirname, 'C:\\Users\\maysh\\Desktop\\Dos\\project', 'BookData.txt');



// Function to read data from the file
function readDataFromFile() {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const rows = data.split('\n').map(row => {
        const [id, bookTopic, numberOfItems, bookCost, bookTitle] = row.split(',');
        return { id, bookTopic, numberOfItems, bookCost, bookTitle };
    });
    return rows;
}

// Route to search for books by topic
app.get('/search/:bookTopic', (req, res) => {
    const bookTopic = req.params.bookTopic.trim();
    const data = readDataFromFile();
    console.log('Data from file:', data); // Log data from the file
    const filteredData = data.filter(row => {
        console.log('Row Book Topic:', row.bookTopic); // Log the Book Topic from the data row
        console.log('Requested Book Topic:', bookTopic); // Log the Book Topic requested in the URL
        return row.bookTopic === bookTopic;
    });
    console.log('Searching for Book Topic:', bookTopic); // Log the Book Topic being searched for
    res.json({ items: filteredData });
});



app.get('/info/:id', (req, res) => {
    const id = req.params.id.trim(); // Trim the id to remove whitespace
    const data = readDataFromFile();
    console.log('Data from file:', data); // Log data from the file
    const foundItem = data.find(row => {
        console.log('Row ID:', row.id); // Log the ID from the data row
        console.log('Requested ID:', id); // Log the ID requested in the URL
        return row.id === String(id);
    });
    console.log('Searching for ID:', id); // Log the ID being searched for
    if (foundItem) {
        res.json({ item: foundItem });
    } else {
        console.log('Item not found for ID:', id); // Log if item not found
        res.status(404).json({ error: 'Item not found' });
    }
});






app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
