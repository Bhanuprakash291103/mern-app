import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setNote(response.data);
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
      } catch (error) {
        console.error("Error fetching note:", error);
        setError("Failed to load the note. Please try again.");
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete the note.");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { title: editedTitle, content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setNote({ ...note, title: editedTitle, content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update the note.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!note) return <p>Loading...</p>;

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleUpdate}>💾 Save</button>
          <button onClick={() => setIsEditing(false)}>❌ Cancel</button>
        </div>
      ) : (
        <div>
          <h1>{note.title}</h1>
          <p>{note.content}</p>
          <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
          <button onClick={handleDelete} style={{ color: "red" }}>
            🗑️ Delete
          </button>
          <button onClick={() => navigate("/")}>🔙 Back</button>
        </div>
      )}
    </div>
  );
};

export default NoteDetails;
