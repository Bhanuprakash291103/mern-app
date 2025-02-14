import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Name"
        className="form-input"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="form-input"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="form-input"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button className="form-button" onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;