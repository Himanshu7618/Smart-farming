import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/apiServices";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.login(email, password);
      console.log("Response data:", res.data);
      localStorage.setItem("token", res.data.token);
      alert("Login Successful ✅");
      navigate("/dashboard");
    } catch (error) {
      console.log("ERROR:", error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;