# etsy-oauthapi-node

This is an example `node` implementation of Etsy's new v3 Oauth API. The code here is a modified version of Etsy's quickstart tutorial with all components packaged into a simple `server.js` file. The end result of this app will be a completed Oauth flow with valid refresh and access tokens.

> **REF:** <https://developers.etsy.com/documentation/tutorials/quickstart>

## Requirements
1. An Etsy approved app. Request one [here](https://www.etsy.com/developers/register).
2. After approved (could take several days), update your redirect URI on the Etsy manage my apps page [here](https://www.etsy.com/developers/your-apps). If you don't know what to put, input `http://localhost:3003`. That's what we use in this example.

> **NOTE:** `v3` of Etsy's API is new and all new apps (as of early 2022) must use this version. See timeline [here](https://developers.etsy.com/documentation/migration/index/#launch-stages).

## Setup

```sh
$ git clone git@github.com:cmd-not-found/etsy-oauthapi-node.git
$ cd ./etsy-oauthapi-node/etsyapp
$ npm install
```

## Configure `.env`

> **REF:** <https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786>

In your `etsyapp/` directory, add a `.env` file with contents similar to below except adjust for your API keystring.

```
# API
API_TOKEN=1aa2bb33c44d55eeeeee6fff
```

## Auth Flow

Start the server.

```sh
$ node server.js
```

Navigate to your web app's URL. If you haven't made any modifications to this project, your URL will be:

> <http://localhost:3003>

Click the **Authenticate with Etsy** link on the web page. This will redirect you to Etsy to authenticate. Once authenticated, the flow will take you back to the the redirect URI you specified earlier 

> **REF:** <https://developers.etsy.com/documentation/essentials/authentication#redirect-uris>

If everything went well, you'll see in your web browser JSON that looks like this:

```json
{
    "access_token":"12345678.REALLLYlong-stringwithnumbersANDUPPERcaseletters_andsomeunder_scores_0324B1a",
    "token_type":"Bearer",
    "expires_in":3600,
    "refresh_token":"12345678.REALLLYlong-stringwithnumbersANDUPPERcaseletters_andsomeunder_scores_0324B1a"
}
```

You can now use this access token to make subsequent API calls to the various endpoints that are applicable for the scope that was requested in the authentication flow. By default, this example app requests the following scopes: `email_r`, `shops_r`, `profile_r`, and `transactions_r`. The scopes are defined in `server.js` with the following statement:

```js
const contexts = 'email_r%20shops_r%20profile_r%20transactions_r'
```

For more informatin on scopes, read [here](https://developers.etsy.com/documentation/essentials/authentication#scopes). 

## References

> **REF:** <https://medium.com/programming-sage/handlebars-in-node-js-tutorial-a30a41fc6206>