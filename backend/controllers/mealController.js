const Meal = require('../models/Meal');

// Create a new meal
exports.addMeal = async (req, res) => {
  try {
    const { name, type, calories, quantity, date } = req.body; // ← add quantity here
    const newMeal = new Meal({
      user: req.user.id,
      name,
      type,
      calories,
      quantity,   // ← add this line
      date
    });
    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    console.error(err.message); // ← log the real error too
    res.status(500).send('Server Error');
  }
};

// Get only the logged-in user's meals
exports.getMeals = async (req, res) => {
    try {
        const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
        res.json(meals);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update a meal
exports.updateMeal = async (req, res) => {
    try {
        let meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ msg: 'Meal not found' });

        // Make sure user owns the meal
        if (meal.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        meal = await Meal.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(meal);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete a meal
exports.deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ msg: 'Meal not found' });

        if (meal.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Meal.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Meal removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};