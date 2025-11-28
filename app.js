const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/device');
const sliderRoutes = require('./routes/sliderRoutes');
const albumRoutes = require('./routes/albumRoutes');
const uploadRoute = require("./routes/uploadRoute");



const { swaggerUi, specs } = require("./swaggerOptions");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));



app.use(cors({
  origin: "*", // or your domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/auth', authRoutes);
app.use('/device', deviceRoutes);
app.use('/slider', sliderRoutes);
app.use('/album', albumRoutes);
app.use("/upload", uploadRoute);

// MongoDB connection
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_NAME = process.env.DB_NAME;

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

// Routes
// app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 API is running securely!');
});

module.exports = app;
