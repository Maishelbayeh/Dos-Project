const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3005;

app.use(express.json());
app.use(cors());
//C:\Users\maysh\Desktop\Dos\project\BookData.txt
const dataFilePath = path.resolve('', 'BookData.txt');

console.log(dataFilePath);

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


app.post("/order", (req, res) => {
  const id = req.body.id.trim();
  const number = parseInt(req.body.number); // Parse number to integer
  const data = readDataFromFile();
  console.log("Data from file:", data);
  const foundItemIndex = data.findIndex((row) => {
    console.log("Row ID:", row.id);
    console.log("Requested ID:", id);
    return row.id === String(id);
  });
  console.log("Searching for ID:", id);
  if (foundItemIndex !== -1) {
    const foundItem = data[foundItemIndex];

    if (foundItem.numberOfItems > 0) {
      foundItem.numberOfItems -= number; // Subtract parsed number

      const updatedData = data.map((row, index) => {
        if (index === foundItemIndex) {
          return foundItem;
        } else {
          return row;
        }
      });
      const newDataString = updatedData
        .map((row) => Object.values(row).join(","))
        .join("\n");
      fs.writeFileSync(dataFilePath, newDataString);

      res.json({ item: foundItem });
    } else {
      console.log("Not enough items in stock for ID:", id);
      res.status(400).json({ error: "Not enough items in stock" });
    }
  } else {
    console.log("Item not found for ID:", id);
    res.status(404).json({ error: "Item not found" });
  }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
