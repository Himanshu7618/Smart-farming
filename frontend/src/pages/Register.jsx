import { useState } from "react";
import { userAPI } from "../api/apiServices";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.register(name, email, password);
      console.log(res.data);
      alert("Registered ✅");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Server not responding");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        {/* <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        /> */}

        <br />

        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <br />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;