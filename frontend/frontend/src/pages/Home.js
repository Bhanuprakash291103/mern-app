import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "" });
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Authentication failed. Please log in again.");

    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes || []);
    } catch (error) {
      setError("Failed to fetch notes.");
    }
  };

  const createNote = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Authentication failed. Please log in again.");
    if (!newNote.title || !newNote.content || !newNote.category) return alert("Fill in all fields.");

    try {
      const res = await axios.post("http://localhost:5000/api/notes/add-note", newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes([...notes, res.data.note]);
      setNewNote({ title: "", content: "", category: "" });
    } catch (error) {
      setError("Failed to create note.");
    }
  };

  const deleteNote = async (noteId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Authentication failed. Please log in again.");

    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      setError("Failed to delete note.");
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Authentication failed. Please log in again.");

    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.map((note) => (note._id === editingNote._id ? res.data.note : note)));
      setEditingNote(null);
      setNewNote({ title: "", content: "", category: "" });
    } catch (error) {
      setError("Failed to update note.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const summarizeNote = async (noteId, noteContent) => {
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key is missing!");

      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [{ parts: [{ text: `Summarize this note: "${noteContent}"` }] }],
      };

      const res = await axios.post(apiUrl, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Full API Response:", res.data);

      if (!res.data || !res.data.candidates || res.data.candidates.length === 0) {
        throw new Error("No response data from AI.");
      }

      const summary = res.data.candidates[0]?.content?.parts[0]?.text || "Summary unavailable";
      console.log("Extracted Summary:", summary);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, summary } : note
        )
      );
    } catch (error) {
      console.error("Error summarizing note:", error.response?.data || error.message);
      setError("Failed to summarize note.");
    }
  };

  return (
    <div className="container">
      <h2>My Notes</h2>
      {error && <p className="error">{error}</p>}

      {notes.length === 0 ? (
        <p>No notes available. Add one!</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note._id} className="note-item">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              {note.summary && <p><strong>Summary:</strong> {note.summary}</p>}
              <small>Category: {note.category}</small>
              <br />
              <button onClick={() => summarizeNote(note._id, note.content)}>Summarize</button>
              <button onClick={() => setEditingNote(note)}>Edit</button>
              <button onClick={() => deleteNote(note._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div className="note-form">
        <h3>{editingNote ? "Edit Note" : "Add a Note"}</h3>
        <input
          type="text"
          placeholder="Title"
          className="form-input"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Content"
          className="form-input"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          className="form-input"
          value={newNote.category}
          onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
        />
        {editingNote ? (
          <button className="form-button" onClick={updateNote}>Update Note</button>
        ) : (
          <button className="form-button" onClick={createNote}>Add Note</button>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;