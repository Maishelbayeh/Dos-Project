const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3006;

app.use(express.json());
app.use(cors());

const dataFilePath = path.resolve(
  __dirname,
  "C:\\DOS\\project",
  "BookData.txt"
);

function readDataFromFile() {
  const data = fs.readFileSync(dataFilePath, "utf8");
  const rows = data.split("\n").map((row) => {
    const [id, bookTopic, numberOfItems, bookCost, bookTitle] = row.split(",");
    return { id, bookTopic, numberOfItems, bookCost, bookTitle };
  });
  return rows;
}

app.post("/purchase/:id", (req, res) => {
  const id = req.params.id.trim();
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
      foundItem.numberOfItems--;

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
