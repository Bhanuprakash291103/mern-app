// AddNote.js - Styled with Tailwind CSS
import React, { useState } from "react";
import axios from "axios";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/notes", { title, content });
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Note</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Title" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="Content" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add Note</button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;