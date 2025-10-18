import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/images/Asset_3.webp";
import {
  LoginScreenWrap,
  LeftSection,
  RightSection,
  FormContainer,
  InfoContainer,
} from "./LoginsScreen.styles";
import { loginDesigner } from "../../service/authService";
import { isAuthenticated } from "../../service/cookieService";
import { useAuth } from "../../context/AuthContext";

function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginDesigner(email, password);

      // Update auth context
      login(response);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginScreenWrap>
      <LeftSection>
        <FormContainer>
          <div className="logo-section">
            <img
              src={logo}
              alt="Brand Logo"
              className="logo"
              style={{ width: "200px", height: "120px" }}
            />
          </div>
          <h1>Welcome Back!</h1>
          <p>Access Your admin panel from here</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Sign in"}
            </button>
            <div className="separator">or</div>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </FormContainer>
      </LeftSection>
    </LoginScreenWrap>
  );
}

export default Loginscreen;
