const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// === Connect to MongoDB ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// === User Schema ===
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  fullName: String,
});

const User = mongoose.model('User', userSchema);

// === Thought Schema ===
const thoughtSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Thought = mongoose.model('Thought', thoughtSchema);

// === Signup Route ===
app.post('/api/signup', async (req, res) => {
  const { username, password, email, fullName } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: 'Username already exists' });

  const user = new User({ username, password, email, fullName });
  await user.save();
  res.json({ message: 'Signup successful!', userId: user._id });
});

// === Login Route ===
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  res.json({ message: 'Login successful!', userId: user._id });
});

// === Add Thought ===
app.post('/api/thoughts', async (req, res) => {
  const { userId, mood, text } = req.body;

  try {
    const newThought = new Thought({ userId, mood, text });
    await newThought.save();
    res.json({ message: 'Thought saved successfully!', thoughtId: newThought._id });
  } catch (error) {
    console.error('Error saving thought:', error);
    res.status(500).json({ error: 'Failed to save thought' });
  }
});

// === Update Thought by ID ===
app.put('/api/thoughts/:id', async (req, res) => {
  const { mood, text } = req.body;
  try {
    await Thought.findByIdAndUpdate(req.params.id, { mood, text });
    res.json({ message: 'Thought updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update thought' });
  }
});

// === Delete Thought by ID ===
app.delete('/api/thoughts/:id', async (req, res) => {
  try {
    await Thought.findByIdAndDelete(req.params.id);
    res.json({ message: 'Thought deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete thought' });
  }
});

// === Get All Thoughts for a User ===
app.get('/api/thoughts/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const thoughts = await Thought.find({ userId }).sort({ date: -1 }); // newest first
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch thoughts' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
