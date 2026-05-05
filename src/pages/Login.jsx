import { useState, useContext } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginFunction } from "../services";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";
import "../styles/login.css";

export default function Login({ setTokenTitle }) {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setToken, refreshCart, refreshLikes } = useContext(DataContext);

  return (
    <section className="login-section">
      <div>
        <img src="/signImg.png" className="login-image" alt="Login banner" />
      </div>

      <div className="login-form-container">
        <h1 className="login-title">Log in to Exclusive</h1>
        <p className="login-subtitle">Enter your details below</p>

        <form
          className="login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!username || !password) return;
            setError("");
            setLoading(true);
            const info = await loginFunction(username, password);
            setLoading(false);
            if (info?.access) {
              localStorage.setItem("token", info.access);
              setToken(info.access);
              if (setTokenTitle) setTokenTitle(info.access);
              refreshCart(info.access);
              refreshLikes(info.access);
              navigate("/");
            } else {
              setError("Login yoki parol noto'g'ri");
            }
          }}
        >
          <input
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username yoki Email"
            className="login-input"
          />

          <div className="login-password-wrapper">
            <input
              onInput={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              placeholder="Parol"
              className="login-password-input"
            />
            <span onClick={() => setShowPass(!showPass)} className="login-eye-icon">
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {error && <p style={{ color: "#ed3729", fontSize: 13, margin: "0 0 4px" }}>{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Kirish..." : "Kirish"}
          </button>
        </form>

        <button type="button" className="login-forget-pass">
          Parolni unutdingizmi?
        </button>
      </div>
    </section>
  );
}
