const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
var request = require('request');
const CLIENT_ID = '1000.HO0WOUUJEWXNW9EIJS1Z7DBNH8KTAQ';
const CLIENT_SECRET = '80b00d47485095c6684ea4345bc8a028b113f685f5';
const REDIRECT_URI = 'https://sudipmailengine.onrender.com/callback';
const AUTHORIZATION_URL = 'https://accounts.zoho.in/oauth/v2/auth';
const TOKEN_URL = 'https://accounts.zoho.in/oauth/v2/token';
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.get('/authorize', (req, res) => {
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'ZohoMail.organization.accounts.ALL',
  };
  const authorizationUrl = `${AUTHORIZATION_URL}?${querystring.stringify(params)}`;
  console.log(authorizationUrl, "authorizationUrl");
  setTimeout(() => {
    res.redirect(authorizationUrl);
  }, 10000)

});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log(code, "code");
  const params = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: code,
    scope: "ZohoMail.partner.organization.ALL",
    state: "WB"
  };

  try {
    const response = await axios.post(TOKEN_URL, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(response.data);
    const accessToken = response.data.access_token;
    console.log(accessToken, "accessToken");
    res.send(`Access token: ${accessToken}`);
  } catch (error) {
    console.error(error);
    res.send('Error occurred');
  }
});
app.post('/sendmail', async (req, res) => {
  let { authToken, fromAddress, toAddress, subject, content, accountId } = req.body

  
  const options = {
    'method': 'POST',
    'url': `https://mail.zoho.in/api/accounts/${accountId}/messages`,
    'headers': {
      'Authorization': `Zoho-oauthtoken ${authToken}`,
      'Content-Type': 'application/json',
      'Cookie': 'zmuac=NjAwMjEwMzIzNTZfMjQ2MDA2OQ==; stk=847086a69e85b68e7a48adc1c850a9a0; 41d1edd07e=d301060b6da68a115fd1c075cd3651c1; JSESSIONID=F46C0FA89D9DAEE459D5117AAC7D6DD0; _zcsr_tmp=7e74112f-21e7-49e8-9b38-daa451113221; zmcsr=7e74112f-21e7-49e8-9b38-daa451113221'
    },
    body: JSON.stringify({
      "fromAddress":fromAddress,
      "toAddress": toAddress,
      "ccAddress": "",
      "bccAddress": "",
      "subject":subject,
      "content": content,
      "askReceipt": "yes"
    })
  
  };
  console.log(options);
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send(`mail send succesfully to ${toAddress} from ${fromAddress}`)
  });
}
);
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
