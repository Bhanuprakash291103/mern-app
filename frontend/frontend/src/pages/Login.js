import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("🔹 Sending login request with:", formData); // Debugging Line

      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // ✅ Store both `authToken` and `userId`
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      console.log("✅ Login successful: Token & UserID stored");
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
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
      <button className="form-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;