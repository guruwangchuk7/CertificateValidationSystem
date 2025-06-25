require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Import routes before using them
const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
