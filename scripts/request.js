const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    // eslint-disable-next-line no-undef
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

const data = {
  user: {
    username: 'admin',
    password: 'admin'
  }
};
req.write(JSON.stringify(data));
req.end();
