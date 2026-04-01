import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgb(100 255 243 / 7%)",
    padding: "2rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid rgb(108 141 138 / 24%)",
  },
  header: {
    background: "rgb(0 70 65)",
    padding: "1.3rem 2.5rem 1rem",
    position: "relative",
    overflow: "hidden",
  },
  headerSubtitle: {
    fontSize: "13px",
    color: "white",
    fontWeight: 300,
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: "-0.5px",
    lineHeight: "2",
  },
  headerAccent: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    color: "#c8b89a",
    fontSize: "32px",
    fontWeight: 400,
  },
  headerDesc: {
    margin: 0,
    fontSize: "13px",
    color: "white",
    fontWeight: 300,
  },
  body: {
    padding: "2.5rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#999",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid rgb(108 141 138)",
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1a1a",
    background: "rgb(244 255 254 / 44%)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
  },
  forgotRow: {
    textAlign: "right",
    marginBottom: "1.5rem",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#888",
    textDecoration: "none",
  },
  btnSignin: {
    width: "100%",
    padding: "14px",
    background: "rgb(8 129 120)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.02em",
    marginBottom: "2rem",
    opacity: 1,
    transition: "opacity 0.2s",
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  badgeStrip: {
    display: "flex",
    gap: "8px",
    marginTop: "1.5rem",
    justifyContent: "center",
  },
  badge: {
    fontSize: "11px",
    color: "#aaa",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  badgeDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#c8b89a",
  },
  signupRow: {
    textAlign: "center",
    fontSize: "14px",
    color: "#888",
    marginTop: "1.5rem",
  },
  signupLink: {
    color: "#1a1a1a",
    fontWeight: 500,
    textDecoration: "none",
    marginLeft: "4px",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "1px",
  },
};

const Login = () => {
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.hargunmusicals.com/api/v1/login",
        formData,
        { withCredentials: true }        // agar backend cookie set karta hai
      );

      const { data } = response;

      if (data.success) {
        // Token ko sessionStorage mein save karo
        if (data.token) {
          localStorage.setItem("token_login", data.token);
        }

        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error) {
      const res = error?.response;

      // ── Account not verified ──────────────────────────────────────────
      if (res?.status === 403 && res?.data?.data) {
        const email = res.data.data;
        const contactNumber = res.data?.ContactNumber || "";

        toast.error("Account not verified. Redirecting to OTP...");
        setTimeout(() => {
          window.location.href = `/Verify-Otp?type=register&email=${email}&number=${contactNumber}`;
        }, 2000);
        return;
      }

      // ── All other errors (wrong password, blocked, not found, etc.) ───
      const message =
        res?.data?.message || res?.data?.msg || "Login failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div style={styles.page}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <p style={styles.headerSubtitle}>Welcome back</p>
            <h1 style={styles.headerTitle}>
              Log <span style={styles.headerAccent}>in</span>
            </h1>
            <p style={styles.headerDesc}>Enter your credentials to continue</p>
          </div>

          {/* Body */}
          <div style={styles.body}>
            <div style={styles.fieldGroup}>
              <div>
                <label style={styles.label} htmlFor="login-email">
                  Email address
                </label>
                <input
                  style={styles.input}
                  type="email"
                  id="login-email"
                  name="Email"                          // Capital — matches controller
                  placeholder="you@example.com"
                  value={formData.Email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={styles.label} htmlFor="login-password">
                  Password
                </label>
                <input
                  style={styles.input}
                  type="password"
                  id="login-password"
                  name="Password"                       // Capital — matches controller
                  placeholder="••••••••"
                  value={formData.Password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={styles.forgotRow}>
              <a style={styles.forgotLink} href="/forget-password">
                Forgot password?
              </a>
            </div>

            <button
              style={{
                ...styles.btnSignin,
                ...(loading ? styles.btnDisabled : {}),
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div style={styles.badgeStrip}>
              <span style={styles.badge}>
                <span style={styles.badgeDot}></span>Secure login
              </span>
              <span style={styles.badge}>
                <span style={styles.badgeDot}></span>256-bit encrypted
              </span>
            </div>

            <p style={styles.signupRow}>
              Don't have an account?
              <a style={styles.signupLink} href="/register">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;