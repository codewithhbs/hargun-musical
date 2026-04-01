import React, { useState } from "react";
import axios from "axios";

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'DM Sans', sans-serif",
    background: "rgb(100 255 243 / 7%)",
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    top: "-80px",
    right: "-80px",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(200,184,154,0.12)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "absolute",
    bottom: "-60px",
    left: "-60px",
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    background: "rgba(26,26,26,0.05)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgb(108 141 138 / 24%)",
    position: "relative",
    zIndex: 1,
  },
  header: {
    background: "rgb(0 70 65)",
    padding: "1.5rem 1.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#ffffff",
    margin: "0 0 2px",
    letterSpacing: "-0.3px",
    lineHeight: "2",
  },
  headerAccent: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    color: "#c8b89a",
  },
  headerSub: {
    fontSize: "12px",
    color: "white",
    margin: 0,
    fontWeight: 300,
  },
  closeBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    flexShrink: 0,
  },
  body: {
    padding: "1.75rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  stepIndicator: { display: "flex", alignItems: "center", gap: "6px" },
  stepDot: { width: "6px", height: "6px", borderRadius: "50%", background: "rgb(108, 141, 138)" },
  stepDotActive: { width: "20px", height: "6px", borderRadius: "3px", background: "rgb(4 83 92)" },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "rgba(244, 255, 254, 0.44)",
    borderRadius: "10px",
    border: "1.5px dashed #e0dbd3",
    cursor: "pointer",
  },
  avatarCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f0ebe3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
  },
  avatarTextStrong: { display: "block", color: "rgb(4 83 92 / 64%)", fontWeight: 500, fontSize: "13px" },
  avatarTextSub: { fontSize: "11.5px", color: "#aaa" },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#bbb",
    margin: "0 0 8px",
  },
  fieldRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  fieldBlock: { display: "flex", flexDirection: "column", gap: "5px" },
  fieldBlockFull: { display: "flex", flexDirection: "column", gap: "5px", gridColumn: "1 / -1" },
  fieldLabel: {
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#aaa",
  },
  fieldInput: (err) => ({
    width: "100%",
    padding: "11px 14px",
    border: `1.5px solid ${err ? "#e24b4a" : "rgb(108, 141, 138)"}`,
    borderRadius: "10px",
    fontSize: "13.5px",
    fontFamily: "'DM Sans', sans-serif",
    color: "rgb(4 83 92)",
    background: "rgba(244, 255, 254, 0.44)",
    outline: "none",
    boxSizing: "border-box",
  }),
  divider: { display: "flex", alignItems: "center", gap: "8px" },
  dividerLine: { flex: 1, height: "1px", background: "rgb(108, 141, 138)" },
  dividerText: { fontSize: "11px", color: "#ccc" },
  passwordWrapper: { position: "relative" },
  passwordInputPadded: (err) => ({
    width: "100%",
    padding: "11px 44px 11px 14px",
    border: `1.5px solid ${err ? "#e24b4a" : "rgb(108, 141, 138)"}`,
    borderRadius: "10px",
    fontSize: "13.5px",
    fontFamily: "'DM Sans', sans-serif",
    color: "rgb(4 83 92)",
    background: "rgba(244, 255, 254, 0.44)",
    outline: "none",
    boxSizing: "border-box",
  }),
  eyeToggle: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "11px",
    color: "rgb(4 83 92 / 64%)",
    background: "none",
    border: "none",
    padding: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  },
  strengthBar: { display: "flex", gap: "4px", marginTop: "6px" },
  strengthSeg: { height: "3px", flex: 1, borderRadius: "2px", background: "rgb(108, 141, 138)" },
  strengthSegFilled: { height: "3px", flex: 1, borderRadius: "2px", background: "#c8b89a" },
  strengthText: { fontSize: "10px", color: "#bbb", marginTop: "3px" },
  errorMsg: {
    fontSize: "12px",
    color: "#e24b4a",
    background: "#fff5f5",
    border: "1px solid #fcc",
    borderRadius: "8px",
    padding: "10px 12px",
    lineHeight: 1.5,
  },
  successMsg: {
    fontSize: "12px",
    color: "#3b6d11",
    background: "#eaf3de",
    border: "1px solid #c0dd97",
    borderRadius: "8px",
    padding: "10px 12px",
    lineHeight: 1.5,
  },
  btnCreate: (loading) => ({
    width: "100%",
    padding: "13px",
    background: loading ? "rgb(4 83 92 / 64%)" : "rgb(4 83 92)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: loading ? "not-allowed" : "pointer",
    letterSpacing: "0.02em",
    transition: "background 0.2s",
  }),
  termsNote: { fontSize: "11.5px", color: "#aaa", textAlign: "center", lineHeight: 1.6 },
  termsLink: { color: "rgb(4 83 92)", textDecoration: "underline", textUnderlineOffset: "2px" },
  signinRow: { textAlign: "center", fontSize: "13px", color: "rgb(4 83 92 / 64%)" },
  signinLink: {
    color: "rgb(4 83 92)",
    fontWeight: 500,
    textDecoration: "none",
    marginLeft: "4px",
    borderBottom: "1px solid rgb(4 83 92)",
    paddingBottom: "1px",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getStrength = (val) => {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
};

// ─── Component ─────────────────────────────────────────────────────────────────
const Registration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    ContactNumber: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const strength = getStrength(formData.Password);
  const strengthLabels = ["Enter a password", "Weak", "Fair", "Good", "Strong"];

  const handleChange = (field) => (e) => {
    setFormData((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    setApiError("");
  };

  // ── Client-side validation ──
  const validate = () => {
    const errs = {};
    if (!formData.Name.trim()) errs.Name = true;
    const emailRx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRx.test(formData.Email)) errs.Email = true;
    if (!/^[0-9]{10}$/.test(formData.ContactNumber)) errs.ContactNumber = true;
    if (formData.Password.length < 6) errs.Password = true;
    if (formData.ConfirmPassword !== formData.Password) errs.ConfirmPassword = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    setSuccessMsg("");

    try {
      const response = await axios.post(
        "http://localhost:7500/api/v1/regsiter-user", // keeping exact typo from API spec
        {
          Name: formData.Name,
          Email: formData.Email,
          Password: formData.Password,
          ContactNumber: formData.ContactNumber,
          Role: "User",
        }
      );

      console.log("Submitting Registration Form with Data: done");

      if (response.data.success) {
        setSuccessMsg(
          response.data.message || "Registration successful! Redirecting..."
        );

        const user = response.data.data;

        setTimeout(() => {
          window.location.href = `/Verify-Otp?type=register&email=${
            user?.Email || formData.Email
          }&number=${user?.ContactNumber || formData.ContactNumber}`;
        }, 2000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital@1&display=swap"
        rel="stylesheet"
      />
      <div style={styles.page}>
        <div style={styles.bgCircle1} />
        <div style={styles.bgCircle2} />

        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h2 style={styles.headerTitle}>
                Create an{" "}
                <span style={styles.headerAccent}>Account</span>
              </h2>
              <p style={styles.headerSub}>Fill in your details to get started</p>
            </div>
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          </div>

          {/* Body */}
          <div style={styles.body}>
            <div style={styles.stepIndicator}>
              <div style={styles.stepDotActive} />
              <div style={styles.stepDot} />
              <div style={styles.stepDot} />
            </div>

            {/* Avatar */}
            {/* <div style={styles.avatarRow}>
              <div style={styles.avatarCircle}>📷</div>
              <div>
                <span style={styles.avatarTextStrong}>Upload profile photo</span>
                <span style={styles.avatarTextSub}>Optional · JPG or PNG</span>
              </div>
            </div> */}

            {/* Personal Info */}
            <div>
              <p style={styles.sectionLabel}>Personal info</p>
              <div style={styles.fieldRow}>
                <div style={styles.fieldBlock}>
                  <label style={styles.fieldLabel}>Full name</label>
                  <input
                    style={styles.fieldInput(errors.Name)}
                    type="text"
                    placeholder="Hitesh"
                    value={formData.Name}
                    onChange={handleChange("Name")}
                  />
                </div>
                <div style={styles.fieldBlock}>
                  <label style={styles.fieldLabel}>Phone (10-digit)</label>
                  <input
                    style={styles.fieldInput(errors.ContactNumber)}
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={formData.ContactNumber}
                    onChange={handleChange("ContactNumber")}
                  />
                </div>
                <div style={styles.fieldBlockFull}>
                  <label style={styles.fieldLabel}>Email address</label>
                  <input
                    style={styles.fieldInput(errors.Email)}
                    type="email"
                    placeholder="you@example.com"
                    value={formData.Email}
                    onChange={handleChange("Email")}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>security</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Password */}
            <div>
              <p style={styles.sectionLabel}>Set password</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={styles.fieldBlock}>
                  <label style={styles.fieldLabel}>Password</label>
                  <div style={styles.passwordWrapper}>
                    <input
                      style={styles.passwordInputPadded(errors.Password)}
                      type={showPw ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={formData.Password}
                      onChange={handleChange("Password")}
                    />
                    <button
                      style={styles.eyeToggle}
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div style={styles.strengthBar}>
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={
                          i < strength
                            ? styles.strengthSegFilled
                            : styles.strengthSeg
                        }
                      />
                    ))}
                  </div>
                  <div style={styles.strengthText}>
                    {formData.Password.length === 0
                      ? "Enter a password"
                      : strengthLabels[strength]}
                  </div>
                </div>
                <div style={styles.fieldBlock}>
                  <label style={styles.fieldLabel}>Confirm password</label>
                  <div style={styles.passwordWrapper}>
                    <input
                      style={styles.passwordInputPadded(errors.ConfirmPassword)}
                      type={showCpw ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={formData.ConfirmPassword}
                      onChange={handleChange("ConfirmPassword")}
                    />
                    <button
                      style={styles.eyeToggle}
                      onClick={() => setShowCpw(!showCpw)}
                    >
                      {showCpw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* API Error / Success */}
            {apiError && <div style={styles.errorMsg}>{apiError}</div>}
            {successMsg && <div style={styles.successMsg}>{successMsg}</div>}

            {/* Submit */}
            <button
              style={styles.btnCreate(loading)}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            {/* Terms */}
            <p style={styles.termsNote}>
              By creating an account you agree to our{" "}
              <a style={styles.termsLink} href="#">Terms of Service</a> and{" "}
              <a style={styles.termsLink} href="#">Privacy Policy</a>
            </p>

            {/* Sign in */}
            <p style={styles.signinRow}>
              Already have an account?
              <a style={styles.signinLink} href="/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;