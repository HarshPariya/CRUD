import express from "express";
const app = express();
import connectDB from "./config/db.js";
import User from "./model/userSchema.js";
import bcrypt from "bcrypt";

// Middleware
connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// Register a new user
app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Login a user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (passwordMatches) {
      return res.json({ message: "Login successful" });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Update a user
app.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete a user
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
