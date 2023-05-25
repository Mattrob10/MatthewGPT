const express = require('express');
const cors = require('cors');
require('isomorphic-fetch'); 
require('dotenv').config();
const app = express();
const path = require("path");

const API_KEY = process.env.API_KEY;

app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://matthewgpt.onrender.com');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.post('/completions', async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
