// Import the express library
const express = require('express')

// Create a new express application
const app = express();

// Send a "Hello World!" response to a default get request
app.get('/', (req, res) => {
    res.send('Hello, world!')
})

// Start the server on port 3003
const port = 3003
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
