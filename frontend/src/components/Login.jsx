import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const directRegister = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/");
      return { success: true, message: data.message };
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="Login-Page">
      <input
        type="email"
        value={email}
        placeholder="Enter your E-mail"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Enter your Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="Login-btn" onClick={handleLogin}>
        Login
      </button>
      <h1>Don't have an Account ? </h1>
      <button onClick={directRegister}>Register</button>
      {error && <h1>{error}</h1>}
    </div>
  );
};

export default Login;
