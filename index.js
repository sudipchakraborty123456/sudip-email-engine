const axios = require('axios');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = 3001;
app.use(cookieParser());
// Define Zoho OAuth parameters
const clientId = '1000.AAQ54HYHFI8TOZ4BHFA0U6941681HE';
const clientSecret = '28f4a89964fcae8216bf83fd2edcb70a7cfc4e2a49';
const redirectUri = 'https://sudipmailengine.onrender.com/oauth2callback';
const scope = 'ZohoMail.folders.READ';
app.get('/', (req, res) => {
  res.send(`app working`);
});
// Endpoint for starting the OAuth flow
app.get('/authorize',async (req, res) => {
  console.log('reached authorize');
  const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoMail.folders.READ&client_id=1000.AAQ54HYHFI8TOZ4BHFA0U6941681HE&response_type=code&access_type=offline&redirect_uri=https://sudipmailengine.onrender.com/oauth2callback`;
 console.log(authUrl);
// const a= await axios.get(authUrl)
// console.log(a);
const res1= await new Promise(function(resolve,reject){
  res.redirect(authUrl);
})
 
});

// Endpoint for handling the callback from Zoho
app.get('/oauth2callback', async (req, res) => {
console.log("redirected");
  const { code } = req.query;
  console.log(code,"code");
  try {
    // Exchange authorization code for access token
    const response = await new Promise(function (resolve, reject) {
      axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
        params: {
          code,
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          scope,
        },
      }).then(res=>{
        if (res) {
         
          resolve(res.data.access_token)
        } else {
          reject("There is an Error!")
        }
      })
    })
   
    console.log(response,"token");
    const { access_token } =await response;
    res.send(`Access token: ${access_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting access token');
  }
});




// Add email aliases for a user in the organization
app.put('/add-email-alias/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const emailAliases = req.body.emailAliases;

    // Prepare request payload
    const requestBody = {
      mode: 'addEmailAlias',
      emailAlias: emailAliases,
    };

    // Set request headers
    const requestHeaders = {
      Authorization: `Zoho-authtoken ${zohoAuthToken}`,
    };

    // Send request to Zoho API
    const response = await axios.put(`${zohoAPIBaseUrl}/api/organization/${zohoOrganizationId}/accounts/${accountId}`, requestBody, {
      headers: requestHeaders,
    });

    res.send(`Email aliases added successfully: ${response.data.emailAlias}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding email aliases');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
