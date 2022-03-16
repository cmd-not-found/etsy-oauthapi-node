// Import the express and fetch libraries
const express = require('express');
const fetch = require("node-fetch");
const crypto = require("crypto");
const dotenv = require('dotenv');
const hbs = require("hbs");

// REF Constants
const port = 3003;
const baseurl = `http://localhost:${port}`
dotenv.config();
const apitoken = process.env.API_TOKEN;
const contexts = 'email_r%20shops_r%20profile_r%20transactions_r'

// Create a new express application
const app = express();
app.set("view engine", "hbs");
app.set("views", `${process.cwd()}/views`);

// The next two functions help us generate the code challenge
// required by Etsy’s OAuth implementation.
const base64URLEncode = (str) =>
  str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest();

// We’ll use the verifier to generate the challenge.
// The verifier needs to be saved for a future step in the OAuth flow.
const codeVerifier = base64URLEncode(crypto.randomBytes(32));

// With these functions, we can generate
// the values needed for our OAuth authorization grant.
const codeChallenge = base64URLEncode(sha256(codeVerifier));
const state = Math.random().toString(36).substring(7);

const buildMyUrl = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${baseurl}/oauth/redirect&scope=${contexts}&client_id=${apitoken}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`

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

// This renders our `index.hbs` file.
app.get('/', async (req, res) => {
    res.render("index", { customUrl : buildMyUrl });
});

/**
These variables contain your API Key, the state sent
in the initial authorization request, and the client verifier compliment
to the code_challenge sent with the initial authorization request
*/
const clientID = apitoken;
const clientVerifier = codeVerifier;
const redirectUri = `${baseurl}/oauth/redirect`;

app.get("/oauth/redirect", async (req, res) => {
    // The req.query object has the query params that Etsy authentication sends
    // to this route. The authorization code is in the `code` param
    const authCode = req.query.code;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: clientID,
            redirect_uri: redirectUri,
            code: authCode,
            code_verifier: clientVerifier,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await fetch(tokenUrl, requestOptions);

    // Extract the access token from the response access_token data field
    if (response.ok) {
        const tokenData = await response.json();
        res.send(tokenData);
    } else {
        res.send("oops");
    }
});


// Start the server on port 3003
app.listen(port, () => {
    console.log(`Etsy Example app now listening at... ${baseurl}`);
});