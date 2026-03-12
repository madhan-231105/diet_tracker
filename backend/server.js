const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON data
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes); // Add this line
// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Diet App API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log('DB Connection Error:', err));