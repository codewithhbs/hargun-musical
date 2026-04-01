import React, { useState, useEffect, useRef } from "react";

// ─── Styles ────────────────────────────────────────────────────────────────────
const S = {
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
    maxWidth: "440px",
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgb(108 141 138 / 24%)",
    position: "relative",
    zIndex: 1,
  },
  header: {
    background: "rgb(0, 70, 65)",
    padding: "1.4rem 1.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.3px",
    marginBottom: "2px",
  },
  accent: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    color: "#00464163",
  },
  hSub: { fontSize: "12px", color: "rgba(255,255,255,0.38)", fontWeight: 300 },
  body: {
    padding: "1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  infoBox: {
    background: "#f4fffe",
    borderRadius: "10px",
    border: "1px solid rgb(108 141 138 / 24%)",
    padding: "12px 14px",
  },
  infoIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#6c8d8a40",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    marginBottom: "7px",
  },
  infoTitle: { fontSize: "13px", fontWeight: 500, color: "rgb(0, 70, 65)", marginBottom: "2px" },
  infoSub: { fontSize: "11.5px", color: "#aaa", lineHeight: 1.5 },
  flabel: {
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "8px",
    display: "block",
  },
  otpRow: { display: "flex", gap: "8px" },
  otpInp: (filled, err) => ({
    flex: 1,
    height: "52px",
    border: `1.5px solid ${err ? "#e24b4a" : filled ? "#00464163" : "rgb(108 141 138 / 24%)"}`,
    borderRadius: "10px",
    fontSize: "22px",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: "rgb(0, 70, 65)",
    background: filled ? "#f4fffe70" : "#f4fffe",
    textAlign: "center",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    width: '40px'
  }),
  resendRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rlabel: { fontSize: "12px", color: "#aaa" },
  timer: { fontSize: "12px", color: "#00464163", fontWeight: 500 },
  resendBtn: {
    fontSize: "12px",
    color: "rgb(0, 70, 65)",
    fontWeight: 500,
    background: "none",
    border: "none",
    borderBottom: "1px solid rgb(0, 70, 65)",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: "0 0 1px",
  },
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
  btnVerify: (loading) => ({
    width: "100%",
    padding: "13px",
    background: loading ? "#888" : "rgb(0, 70, 65)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.2s",
  }),
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "12.5px",
    color: "#888",
    background: "none",
    border: "none",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    padding: 0,
    textDecoration: "none",
  },
  // ── Success state ──
  successWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "12px",
    padding: "1.5rem 0",
  },
  successCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#eaf3de",
    border: "2px solid #00464163",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },
  successTitle: { fontSize: "17px", fontWeight: 600, color: "rgb(0, 70, 65)" },
  successSub: { fontSize: "13px", color: "#aaa", lineHeight: 1.6 },
};

// ─── Component ─────────────────────────────────────────────────────────────────
const VerifyOtp = ({ onVerificationSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const inputRefs = useRef([]);

  // ── Read URL params ──
  const location = new URLSearchParams(window.location.search);
  const email = location.get("email");
  const type = location.get("type") || "register";
  const number = location.get("number");
  const userEmail = email || "user@example.com";

  // Mask email for display
  const maskedEmail = userEmail.replace(
    /(.{2})(.*)(@.*)/,
    (_, a, b, c) => a + b.replace(/./g, "*") + c
  );

  // ── Timer ──
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // ── Scroll to top ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ── OTP input handlers ──
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // ── Verify OTP ──
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(
        "https://api.hargunmusicals.com/api/v1/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, otp: otp, type }),
        }
      );
      const data = await response.json();

      if (response.ok && data.token) {
        setSuccessMessage(data.message || "Verification successful!");
        setIsVerified(true);
        localStorage.setItem("token_login", data.token);

        if (onVerificationSuccess) {
          onVerificationSuccess(data);
        } else {
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      } else {
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");

    try {
      const response = await fetch(
        "https://api.hargunmusicals.com/api/v1/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, type }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTimeLeft(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        setSuccessMessage(data.msg || "OTP has been resent to your email.");
        inputRefs.current[0]?.focus();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.msg || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsResending(false);
    }
  };

  // ── Title by type ──
  const titleMap = {
    register: "Verify",
    login: "Verify",
    forgot: "Verify",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital@1&display=swap"
        rel="stylesheet"
      />
      <div style={S.page}>
        <div style={S.bgCircle1} />
        <div style={S.bgCircle2} />

        <div style={S.card}>
          {/* Header */}
          <div style={S.header}>
            <div>
              <div style={S.hTitle}>
                OTP <span style={S.accent}>{titleMap[type] || "Verify"}</span>
              </div>
              <div style={S.hSub}>
                {type === "register"
                  ? "Complete your registration"
                  : type === "forgot"
                  ? "Reset your password"
                  : "Confirm your identity"}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={S.body}>
            {!isVerified ? (
              <>
                {/* Info box */}
                <div style={S.infoBox}>
                  <div style={S.infoIcon}>📨</div>
                  <div style={S.infoTitle}>Check your email</div>
                  <div style={S.infoSub}>
                    A 6-digit code was sent to{" "}
                    <strong style={{ color: "#555" }}>{maskedEmail}</strong>
                    {number && (
                      <>
                        {" "}
                        and ending in{" "}
                        <strong style={{ color: "#555" }}>
                          ···{number.slice(-3)}
                        </strong>
                      </>
                    )}
                    . Valid for 1 minute.
                  </div>
                </div>

                {/* OTP inputs */}
                <div>
                  <label style={S.flabel}>Enter 6-digit code</label>
                  <div style={S.otpRow}>
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        style={S.otpInp(!!val, error && !val)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={i === 0 ? handlePaste : undefined}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend row */}
                <div style={S.resendRow}>
                  <span style={S.rlabel}>Didn't receive it?</span>
                  {canResend ? (
                    <button
                      style={S.resendBtn}
                      onClick={handleResendOtp}
                      disabled={isResending}
                    >
                      {isResending ? "Sending..." : "Resend code"}
                    </button>
                  ) : (
                    <span style={S.timer}>Resend in {formatTime(timeLeft)}</span>
                  )}
                </div>

                {/* Error / Success messages */}
                {error && <div style={S.errorMsg}>{error}</div>}
                {successMessage && (
                  <div style={S.successMsg}>{successMessage}</div>
                )}

                {/* Verify button */}
                <button
                  style={S.btnVerify(isVerifying)}
                  onClick={handleSubmit}
                  disabled={isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify Code →"}
                </button>

                {/* Back link */}
                <a style={S.backLink} href="/register">
                  ← Back to Registration
                </a>
              </>
            ) : (
              /* ── Success state ── */
              <div style={S.successWrap}>
                <div style={S.successCircle}>✓</div>
                <div style={S.successTitle}>Email Verified!</div>
                <div style={S.successSub}>
                  {successMessage || "Your account has been verified successfully."}
                  <br />
                  Redirecting you to home...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;