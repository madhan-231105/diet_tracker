const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addMeal, getMeals, updateMeal, deleteMeal } = require('../controllers/mealController');

// All meal routes are protected with 'auth' middleware
router.post('/', auth, addMeal);
router.get('/', auth, getMeals);
router.put('/:id', auth, updateMeal);
router.delete('/:id', auth, deleteMeal);

module.exports = router;