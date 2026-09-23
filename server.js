import express from "express";
const app = express();
import connectDB from "./config/db.js";
import User from "./model/userSchema.js";
import bcrypt from "bcrypt";

// Middleware
connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HEllo");
});

// Create (Register)
app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.send({ message: "User Already Exist" });
    }
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({ email, name, password: hashedPassword });
    await userData.save();
    return res.send({ message: "User Created Successfully" });
  } catch (err) {
    res.send(err);
  }
});

// Read (Login)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.send({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (passwordMatch) {
      return res.send({ message: "Login Successfully" });
    }
    return res.send({ message: "Invalid Credentials" });
  } catch (err) {
    res.send(err);
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

// Update
app.put("/update/:id", async (req, res) => {
  try {
    const userExist = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!userExist) {
      return res.send({ message: "User not Updated Successfully" });
    }
    res.send({ message: "User Updated Successfully" });
  } catch (err) {
    res.send(err);
  }
});

// Delete
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userExist = await User.findByIdAndDelete(id);
    if (!userExist) {
      return res.send({ message: "User not found " });
    }
    res.send({ message: "User Deleted Successfully " });
  } catch (err) {
    res.send(err);
  }
});

app.listen(5000, () => {
  console.log("Server is running");
});
