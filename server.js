require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const app = require('./app');

const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.SSL_PORT || 3443;

// SSL certificates
const privateKey = fs.readFileSync('./certs/server.key', 'utf8');
const certificate = fs.readFileSync('./certs/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middlewares
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Request timing logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

// Start HTTP
http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`🌐 HTTP Server running on port ${HTTP_PORT}`);
});

// Start HTTPS
https.createServer(credentials, app).listen(HTTPS_PORT, () => {
  console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
});
