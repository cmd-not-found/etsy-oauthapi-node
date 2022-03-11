// Import the express and fetch libraries
const express = require('express');
const fetch = require("node-fetch");

// REF 
// https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
const dotenv = require('dotenv');
dotenv.config();
const apitoken = process.env.API_TOKEN;
// REF

// Create a new express application
const app = express();

// Send a JSON response to a default get request
app.get('/ping', async (req, res) => {
    const requestOptions = {
        'method': 'GET',
        'headers': {
            'x-api-key': apitoken,
        },
    };

    const response = await fetch(
        'https://api.etsy.com/v3/application/openapi-ping',
        requestOptions
    );

    if (response.ok) {
        const data = await response.json();
        res.send(data);
    } else {
        res.send("oops");
    }
});

// Start the server on port 3003
const port = 3003;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});