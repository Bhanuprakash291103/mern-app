const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// 🟢 GET all notes for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ success: false, message: "Error fetching notes" });
  }
});

// 🟢 GET a single note by ID for the authenticated user
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ success: false, message: "Error fetching note" });
  }
});

// 🟢 POST a new note (User-specific)
router.post("/add-note", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: "Title, content, and category are required." });
    }

    const newNote = new Note({
      title,
      content,
      category,
      userId: req.userId,
    });

    await newNote.save();
    res.status(201).json({ success: true, message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ success: false, message: "Error creating note" });
  }
});

// 🔵 UPDATE a note by ID for the authenticated user
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title && !content && !category) {
      return res.status(400).json({ success: false, message: "At least one field (title, content, or category) must be updated." });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content, category },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ success: false, message: "Error updating note" });
  }
});

// 🔴 DELETE a note by ID for the authenticated user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!deletedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
});

module.exports = router;
