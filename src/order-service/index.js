const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define your routes
app.post("/purchase/:id/:number", async (req, res) => {
  const orderId = req.params.id; // Extract id from URL parameters
  console.log("Received order ID:", orderId);

  const number = req.params.number; // Extract number from URL parameters
  console.log("Received order cost:", number);

  const order = {
    id: orderId,
    number: number
  };

  console.log("Order object:", order); // Log the constructed order object

  try {
    const response = await axios.post(`http://catalog-server:3005/order`, order);
    console.log("Response from catalog:", response.data); // Log the response from the catalog
    console.log("Request sent to catalog");
  } catch (error) {
    console.error("Error:", error); // Log any errors that occur during the request
    return res.status(500).send({ error: "Internal Server Error" });
  }

  // Send a response back to the client if needed
  res.send('Order received successfully!');
});

// Your other routes
app.get("/test", (req, res) => {
  res.send({ Message: "Arrived" });
});

// Start the server
const port = 3006;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
