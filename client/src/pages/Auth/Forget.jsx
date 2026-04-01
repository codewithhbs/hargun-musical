import React, { useState, useEffect, useRef } from "react";

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgb(100 255 243 / 7%)",
    padding: "2rem 1rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
    background: "#fff",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid rgb(108 141 138 / 24%)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  header: {
    background: "rgb(0, 70, 65)",
    padding: "1.5rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accent: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    color: "rgb(200, 184, 154)",
    fontSize: "22px",
    fontWeight: 400,
  },
  hSub: {
    fontSize: "13px",
    color: "white",
    fontWeight: 400,
    marginTop: "4px",
  },
  stepsBar: {
    display: "flex",
    alignItems: "center",
    padding: "1.75rem 2rem 0.5rem",
    gap: 0,
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
  },
  stepCircle: (state) => ({
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    flexShrink: 0,
    transition: "all 0.3s",
    border:
      state === "done"
        ? "2px solid rgb(0, 70, 65)"
        : state === "active"
          ? "2px solid rgb(0, 70, 65)"
          : "2px solid #00464163",
    background:
      state === "done"
        ? "rgb(0, 70, 65)"
        : state === "active"
          ? "rgb(0, 70, 65)"
          : "transparent",
    color: state === "idle" ? "#aaa" : "#fff",
  }),
  stepLabel: (active) => ({
    fontSize: "14px",
    color: active ? "rgb(0, 70, 65)" : "#999",
    fontWeight: active ? 600 : 500,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  }),
  connector: (done) => ({
    flex: 1,
    height: "2px",
    background: done ? "rgb(0, 70, 65)" : "#00464163",
    margin: "0 8px",
    transition: "background 0.3s",
  }),
  body: {
    padding: "2rem 2rem 2.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  infoBox: {
    background: "rgb(244 255 254)",
    borderRadius: "12px",
    border: "1px solid #6c8d8a40",
    padding: "1.25rem 1.5rem",
  },
  infoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#6c8d8a40",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    marginBottom: "10px",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "rgb(0, 70, 65)",
    marginBottom: "4px",
  },
  infoSub: {
    fontSize: "13px",
    color: "#777",
    lineHeight: 1.5,
  },
  fieldBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  flabel: {
    fontSize: "11.5px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#777",
  },
  finput: (err) => ({
    width: "100%",
    padding: "13px 16px",
    border: `2px solid ${err ? "#e24b4a" : "#00464163"}`,
    borderRadius: "12px",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    color: "rgb(0, 70, 65)",
    background: "rgba(244, 255, 254, 0.44)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  }),
  pwInput: (err) => ({
    width: "100%",
    padding: "13px 56px 13px 16px",
    border: `2px solid ${err ? "#e24b4a" : "#00464163"}`,
    borderRadius: "12px",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    color: "rgb(0, 70, 65)",
    background: "rgba(244, 255, 254, 0.44)",
    outline: "none",
    boxSizing: "border-box",
  }),
  pwWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "13px",
    color: "#666",
    background: "none",
    border: "none",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
  },
  strBar: { display: "flex", gap: "6px", marginTop: "10px" },
  seg: (on) => ({
    height: "4px",
    flex: 1,
    borderRadius: "4px",
    background: on ? "rgb(0, 70, 65)" : "#00464163",
    transition: "background 0.25s",
  }),
  strTxt: {
    fontSize: "12px",
    color: "#888",
    marginTop: "6px",
    fontWeight: 500,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "4px 0",
  },
  dl: { flex: 1, height: "1px", background: "#00464163" },
  dt: {
    fontSize: "11px",
    color: "#aaa",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  reqList: { display: "flex", flexDirection: "column", gap: "8px" },
  reqItem: (pass) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13.5px",
    color: pass ? "#555" : "#aaa",
    transition: "color 0.2s",
  }),
  reqDot: (pass) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: pass ? "rgb(0, 70, 65)" : "#00464163",
    flexShrink: 0,
  }),
  btnMain: (disabled) => ({
    width: "100%",
    padding: "15px",
    background: disabled ? "#aaa" : "rgb(0, 70, 65)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    marginTop: "8px",
    transition: "background 0.2s",
  }),
  resendRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rlabel: { fontSize: "13.5px", color: "#777" },
  timer: { fontSize: "13.5px", color: "rgb(0, 70, 65)", fontWeight: 600 },
  resendTextBtn: {
    fontSize: "13.5px",
    color: "rgb(0, 70, 65)",
    fontWeight: 600,
    background: "none",
    border: "none",
    borderBottom: "1.5px solid rgb(0, 70, 65)",
    cursor: "pointer",
    padding: "0 0 2px",
    fontFamily: "'DM Sans', sans-serif",
  },
  alertBox: (type) => ({
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: 500,
    background: type === "error" ? "#fff0f0" : "#f0fff4",
    color: type === "error" ? "#c0392b" : "#1a6b3a",
    border: `1px solid ${type === "error" ? "#f5c6c6" : "#b7e4c7"}`,
  }),
  successWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "16px",
    padding: "2.5rem 1rem",
  },
  successCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#f0f7ee",
    border: "2.5px solid rgb(0, 70, 65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    color: "#2e7d32",
  },
  successTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "rgb(0, 70, 65)",
  },
  successSub: {
    fontSize: "14px",
    color: "#666",
    lineHeight: 1.6,
    maxWidth: "420px",
  },
};

const getStrength = (val) => ({
  score: [
    val.length >= 8,
    /[A-Z]/.test(val),
    /[0-9]/.test(val),
    /[^A-Za-z0-9]/.test(val),
  ].filter(Boolean).length,
  rules: {
    len: val.length >= 8,
    upper: /[A-Z]/.test(val),
    num: /[0-9]/.test(val),
    special: /[^A-Za-z0-9]/.test(val),
  },
});

function useCountdown(initial = 60) {
  const [secs, setSecs] = useState(0);
  const ref = useRef(null);

  const start = (from = initial) => {
    clearInterval(ref.current);
    setSecs(from);
    ref.current = setInterval(() => {
      setSecs((p) => {
        if (p <= 1) {
          clearInterval(ref.current);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(ref.current), []);

  const fmt = () => {
    const m = Math.floor(secs / 60),
      s = secs % 60;
    return `Resend in ${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return { secs, start, fmt };
}

const STEPS = ["Email", "OTP", "Password"];
const REQS = [
  { key: "len", label: "At least 8 characters" },
  { key: "upper", label: "One uppercase letter" },
  { key: "num", label: "One number" },
  { key: "special", label: "One special character" },
];
const STR_LABELS = ["Enter a password", "Weak", "Fair", "Good", "Strong"];

const Forget = () => {
  const [step, setStep] = useState(0);          // 0 = Email step only (OTP is on separate page)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({ Email: "", newPassword: "" });
  const [emailErr, setEmailErr] = useState(false);
  const [pwErr, setPwErr] = useState(false);

  const countdown = useCountdown(60);
  const { score, rules } = getStrength(formData.newPassword);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearMessages();
    if (name === "Email") setEmailErr(false);
    if (name === "newPassword") setPwErr(false);
  };

  // ── Validate before calling API ─────────────────────────────────────
  const validate = () => {
    let ok = true;
    if (!formData.Email.trim() || !formData.Email.includes("@")) {
      setEmailErr(true);
      ok = false;
    }
    if (formData.newPassword.length < 8) {
      setPwErr(true);
      ok = false;
    }
    return ok;
  };

  // ── Call /Password-Change-Request ───────────────────────────────────
  const callAPI = async () => {
    const res = await fetch(
      "http://localhost:7500/api/v1/Password-Change-Request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    return { ok: res.ok, data };
  };

  // ── First submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    clearMessages();

    try {
      const { ok, data } = await callAPI();

      if (ok) {
        setSuccessMessage(data.msg || "OTP sent! Redirecting…");
        setIsSubmitted(true);
        countdown.start();
        // Redirect to OTP page after 1.4s
        setTimeout(() => {
          window.location.href = `/Verify-Otp?type=password_reset&email=${formData.Email}&changepassword=true`;
        }, 1400);
      } else {
        setErrorMessage(data.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      setErrorMessage("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend ──────────────────────────────────────────────────────────
  const handleResend = async () => {
    setIsLoading(true);
    clearMessages();
    try {
      const { ok, data } = await callAPI();
      if (ok) {
        setSuccessMessage("OTP sent again!");
        countdown.start();
      } else {
        setErrorMessage(data.message || "Failed to resend. Please try again.");
      }
    } catch {
      setErrorMessage("Resend failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Steps bar: step 0 active always (OTP + Password happen on other pages)
  const stepStateOf = (i) => (i < 0 ? "done" : i === 0 ? "active" : "idle");

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital@1&display=swap"
        rel="stylesheet"
      />
      <div style={S.page}>
        <div style={S.card}>
          {/* ── Header ── */}
          <div style={S.header}>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "-0.3px",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#fff" }}>Forgot </span>
                <span style={S.accent}>Password</span>
              </div>
              <div style={S.hSub}>Step 1 of 3</div>
            </div>
          </div>

          {/* ── Steps Bar ── */}
          <div style={S.stepsBar}>
            {STEPS.map((label, i) => (
              <React.Fragment key={i}>
                <div style={S.stepItem}>
                  <div style={S.stepCircle(stepStateOf(i))}>
                    {stepStateOf(i) === "done" ? "✓" : i + 1}
                  </div>
                  <span style={S.stepLabel(i === 0)}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={S.connector(false)} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── Body ── */}
          <div style={S.body}>
            {/* Alert messages */}
            {errorMessage && (
              <div style={S.alertBox("error")}>⚠ {errorMessage}</div>
            )}
            {successMessage && (
              <div style={S.alertBox("success")}>✓ {successMessage}</div>
            )}

            {/* Info box */}
            <div style={S.infoBox}>
              <div style={S.infoIcon}>✉</div>
              <div style={S.infoTitle}>Reset via email</div>
              <div style={S.infoSub}>
                Enter your email and a new password. We'll send a 6-digit OTP
                to verify your identity before applying the change.
              </div>
            </div>

            {/* Email */}
            <div style={S.fieldBlock}>
              <label style={S.flabel}>Email address</label>
              <input
                style={S.finput(emailErr)}
                type="email"
                name="Email"
                placeholder="you@example.com"
                value={formData.Email}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={isSubmitted}
              />
            </div>

            {/* New password */}
            <div style={S.fieldBlock}>
              <label style={S.flabel}>New password</label>
              <div style={S.pwWrap}>
                <input
                  style={S.pwInput(pwErr)}
                  type={showPw ? "text" : "password"}
                  name="newPassword"
                  placeholder="Min. 8 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isSubmitted}
                />
                <button
                  style={S.eyeBtn}
                  onClick={() => setShowPw((p) => !p)}
                  type="button"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength bar */}
              <div style={S.strBar}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={S.seg(i < score)} />
                ))}
              </div>
              <div style={S.strTxt}>
                {formData.newPassword.length === 0
                  ? "Enter a password"
                  : STR_LABELS[score]}
              </div>
            </div>

            {/* Password requirements */}
            <div style={S.divider}>
              <div style={S.dl} />
              <span style={S.dt}>must have</span>
              <div style={S.dl} />
            </div>
            <div style={S.reqList}>
              {REQS.map(({ key, label }) => (
                <div key={key} style={S.reqItem(rules[key])}>
                  <span style={S.reqDot(rules[key])} />
                  {label}
                </div>
              ))}
            </div>

            {/* Resend row — visible only after first submit */}
            {isSubmitted && (
              <div style={S.resendRow}>
                <span style={S.rlabel}>Didn't get the OTP?</span>
                {countdown.secs > 0 ? (
                  <span style={S.timer}>{countdown.fmt()}</span>
                ) : (
                  <button
                    style={S.resendTextBtn}
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}

            {/* CTA */}
            <button
              style={S.btnMain(isLoading || isSubmitted)}
              onClick={handleSubmit}
              disabled={isLoading || isSubmitted}
            >
              {isLoading
                ? "Sending OTP…"
                : isSubmitted
                  ? "OTP Sent ✓"
                  : "Send OTP →"}
            </button>

            {/* Back to login */}
            <div style={{ textAlign: "center", marginTop: "4px" }}>
              <a
                href="/login"
                style={{
                  fontSize: "13.5px",
                  color: "#666",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "2px",
                }}
              >
                ← Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forget;