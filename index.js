const mongoose = require("mongoose");
const List = require("./models/list.models.js");
const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic start page info
app.get(`/`, (req, res) => {
  res.send("To Do List CRUD API");
});

// Route to get lists (with or without search query)
app.get("/tdl/lists", async (req, res) => {
  try {
    const query = req.query.q;
    let list;
    if (query) {
      list = await List.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { desc: { $regex: query, $options: "i" } },
          { comp: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      list = await List.find({});
    }
    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to get a specific list by ID
app.get("/tdl/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new list item
app.post("/tdl/lists", async (req, res) => {
  try {
    const existingList = await List.findOne({ title: req.body.title });
    if (!existingList) {
      const list = await List.create(req.body);
      return res.status(200).json(list);
    }
    return res.status(400).send("Item with the provided title already exists.");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to update a list item
app.patch("/tdl/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findByIdAndUpdate(id, {
      title: req.body.title,
      desc: req.body.desc,
      comp: req.body.comp,
    });
    if (!list) {
      return res.status(404).json({ message: "Item not found" });
    }
    const updatedList = await List.findById(id);
    res.status(200).json(updatedList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a list item
app.delete("/tdl/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "List item not found" });
    const list = await List.findByIdAndDelete(id);
    if (!list) {
      return res.status(404).json({ message: "List item not found" });
    }
    res.status(200).json({ message: "List item deleted", list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connecting with MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:nodeAPI1@backend.ybcklkj.mongodb.net/TDL-API?retryWrites=true&w=majority&appName=Backend"
  )
  .then(() => {
    console.log("Connected to DB");
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Running on port ${port}...`));
  })
  .catch((error) => {
    console.error("Connection Failed", error);
  });
