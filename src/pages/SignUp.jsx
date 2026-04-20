import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { registerFunction } from "../services";
import "../styles/signup.css";

export default function SignUp() {
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  return (
    <section className="signup-section">
      <div>
        <img src="/signImg.png" className="signup-image" alt="Sign up banner" />
      </div>

      <div className="signup-form-container">
        <h1 className="signup-title">Create an account</h1>
        <p className="signup-subtitle">Enter your details below</p>

        <form
          className="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name || !email || !password) {
              return;
            }
            registerFunction(name, email, password)
              .then((info) => {
                if (info?.id || info?.username) {
                  navigate("/login");
                }
              })
              .catch(() => {});
          }}
        >
          <input
            onInput={(e) => {
              setName(e.target.value);
            }}
            type="text"
            placeholder="Name"
            className="signup-input"
          />

          <input
            onInput={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="Email or Phone Number"
            className="signup-input"
          />

          <div className="signup-password-wrapper">
            <input
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="signup-password-input"
            />
            <span
              className="signup-eye-icon"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        <button type="button" className="signup-google-button">
          <FcGoogle className="signup-google-icon" />
          <span>Sign up with Google</span>
        </button>

        <p className="signup-login-text">
          Already have an account?{" "}
          <Link to={"/login"} className="signup-login-link">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
