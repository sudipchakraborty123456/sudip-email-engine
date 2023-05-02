const axios = require('axios');
const express = require('express');
const app = express();
const port = 3001;

// Define Zoho OAuth parameters
const clientId = '1000.AAQ54HYHFI8TOZ4BHFA0U6941681HE';
const clientSecret = '28f4a89964fcae8216bf83fd2edcb70a7cfc4e2a49';
const redirectUri = 'https://localhost:3000/oauth2callback';
const scope = 'ZohoMail.folders.READ';

// Endpoint for starting the OAuth flow
app.get('/authorize', (req, res) => {
  const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
});

// Endpoint for handling the callback from Zoho
app.get('/oauth2callback', async (req, res) => {

  const { code } = req.query;
  console.log(code);
  try {
    // Exchange authorization code for access token
    const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        scope,
      },
    });

    const { access_token } = response.data;
    res.send(`Access token: ${access_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting access token');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
