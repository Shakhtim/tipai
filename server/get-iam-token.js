const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');

// Твой приватный ключ (замени на свой)
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCjBA5DXbo9w9r8
GKKuuvzPgx0fUAPhESsrQZdjzU+6VKyaIl1SDtnh6EjH5XHBdtsPd+I0+/Yy1SRR
sIyGmyp21dI1k8ZMlLzfzb4ihGLa2cZ1Z1LOZwckWsbNUqf69VWR6AJBbkqmHrZE
hzZQbbcVDT6MNqR5tFzRtpcdqKwOBlBDCczYx9zWN/aoX8eG/7utbpNe1eOc+xVD
KMRdFfkWq138GaRaL/f/PRPOvavtSrf01yRfu7Hhy/W7uyudAV3ds1qEW9RQn7oV
o43E+E7PuQJcFuNJCLE2ro/jEu2QqkERb3TOTHbNrA7YJz088MoVEFtiJlfkGinm
GTTJXCL7AgMBAAECggEAPR68Kk3uElJovLSP6mt5dmR2etMJYU2KngFNvcGw7u/o
dzIDQ00GLElnYGuKpzrlD3uneK4vtQdtQqOrTJzI4x1wX140r2nlFxSRAWgZmGym
mEZRKco/R0Yx27HuAY4Ss04F6npryrUhKbh4iNdaGa6JkRC7wlX5pzeKmTgwqmDi
bdjq+A7AAbXQ03isLraS8yzZ1E6Fld4zCoXRH18e7o9T7mDOselh189WmmSExuil
722aD83j+9qcIGyQvdVws8kWhySqDO2ZCVM/lq9oCX4XEKgEEAK2yyBhQqWANZ2n
44VmHWEjvSkb3WtC/SWrI9yGSAqXST0MmI+XLTIxYQKBgQDNuCXQ1FgkrwqMmv37
ylfSzH0K2lVSWNW1tAfgq7OkitiWZBILw0CrNv3187GZ0D3wriWTOILdYP6bwXcW
0UJj+hlnBa1kbyvlU25SfpCELFsHOlnH83eV0fW+l60DOEzYYq6clUfnDKPwQS3a
j8HpT4Phaaoa+S0ufX+uH8/qfQKBgQDK2/PFKjdgTPTLmK5FLgVIVZbsuuyQuGrK
saq1DEV33iWEZgOK5HJS5VKC5U7XHB5FwRfmxwpIdlCqKtmX6s/JKPgRP03zWARg
NY6cj/g0EAeAtVBfjawKXxrJra1QXvi1ztQUqXXm09v6BArs/IXDoEEmc38JfpI9
Zw5MOllE1wKBgQC85ClU5qVIibEWCfrMB688T6dBH9jYE9mnTfctxHreyt60uI4Z
Xt8yVvw5qdmZcixtonm+BFWlEDq4qZu/x8U+J5bLkdr0LWAQ4dqaxLvNoSy0Jk/p
2RQk7PTIXFzwZ/GnfnT2MdwjuueM40xHM1jJ8ckWYP9gZQundHSYXX17wQKBgQCi
4G+dwwOrYp66SeDC0uyS44XGlV8T4756+KPjsfKlB8x/vZjikAHq5Q2W456lwIHd
5+fU98Md40FpH/aNr48eKLLkxjtEQ0tgJCBZPI9A3g3oHaxmzE1yFmJfw/8AJQD0
mRhXbqinqTtaRpyvIyITrDwjL2C0stegTXqBYegDCQKBgQCHjP5UsQsvE3OPkyJR
FFgZtYEnTN2s6QueOk9fGV862DYxvvkWxUdwUjr7OvBA21YkKZyR8LC55cbS4uPp
oRvHeM9dG8UNgI0knLQj4RYyMhv5ziQcc6DsTs0s8ixWhfW2kDp1QuY2jPwHPnq2
Dsp9QhgzbF+dIMtZ1hCPzUp3oA==
-----END PRIVATE KEY-----`;

const serviceAccountId = 'aje34l9fqlk3u5v6tcc1';
const keyId = 'ajebpj2bkb4qnq7ghtin';

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