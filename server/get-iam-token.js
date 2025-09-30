const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Читаем authorized_key.json
const keyPath = path.join(__dirname, 'authorized_key.json');

if (!fs.existsSync(keyPath)) {
  console.error('Error: authorized_key.json not found!');
  console.error('Please place your authorized_key.json file in the server directory.');
  process.exit(1);
}

const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

const privateKey = keyData.private_key;
const serviceAccountId = keyData.service_account_id;
const keyId = keyData.id;

async function getIAMToken() {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    aud: 'https://iam.api.cloud.yandex.net/iam/v1/tokens',
    iss: serviceAccountId,
    iat: now,
    exp: now + 3600
  };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'PS256',
    keyid: keyId
  });

  const response = await axios.post(
    'https://iam.api.cloud.yandex.net/iam/v1/tokens',
    { jwt: token }
  );

  console.log('IAM Token:', response.data.iamToken);
  return response.data.iamToken;
}

getIAMToken().catch(console.error);