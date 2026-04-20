import { use, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginFunction } from "../services";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/token";
import "../styles/login.css";

export default function Login({ setTokenTitle }) {
  const [showPass, setShowPass] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
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
          onSubmit={(e) => {
            e.preventDefault();
            if (!username || !password) {
              return;
            }
            loginFunction(username, password)
              ?.then((info) => {
                if (info?.access) {
                  localStorage.setItem("token", info.access);
                  navigate("/");
                  setToken(info.access);
                  setTokenTitle(info.access);
                }
              })
              .catch(() => {});
          }}
        >
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="Email or Phone Number"
            className="login-input"
          />

          <div className="login-password-wrapper">
            <input
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="login-password-input"
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="login-eye-icon"
            >
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <button type="button" className="login-forget-pass">
          Forget Password?
        </button>
      </div>
    </section>
  );
}
