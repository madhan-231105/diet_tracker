const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    calories: { type: Number, required: true },
    quantity: { type: String, required: true }, // Add this line
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Meal', MealSchema);