const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const CLIENT_ID = '1000.AAQ54HYHFI8TOZ4BHFA0U6941681HE';
const CLIENT_SECRET = '28f4a89964fcae8216bf83fd2edcb70a7cfc4e2a49';
const REDIRECT_URI = 'https://sudipmailengine.onrender.com/callback';
const AUTHORIZATION_URL = 'https://accounts.zoho.in/oauth/v2/auth';
const TOKEN_URL = 'https://accounts.zoho.in/oauth/v2/token';

const app = express();

app.get('/authorize', (req, res) => {
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'ZohoMail.folders.READ',
  };
  const authorizationUrl = `${AUTHORIZATION_URL}?${querystring.stringify(params)}`;
  console.log(authorizationUrl,"authorizationUrl");
  setTimeout(()=>{
    res.redirect(authorizationUrl);
  },10000)
  
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
console.log(code,"code");
  const params = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: code,
  };

  try {
    const response = await axios.post(TOKEN_URL, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const accessToken = response.data.access_token;
    console.log(accessToken,"accessToken");
    res.send(`Access token: ${accessToken}`);
  } catch (error) {
    console.error(error);
    res.send('Error occurred');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
