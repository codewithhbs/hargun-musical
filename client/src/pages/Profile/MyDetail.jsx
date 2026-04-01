import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Make sure you have react-toastify installed

const MyDetail = () => {
  const token = localStorage.getItem("token_login");

  // Personal Information State
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    ContactNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // For OTP flow
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Password Form, 2: OTP, 3: Success
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:7500/api/v1/my-details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data?.data) {
        setFormData({
          Name: data.data.Name || "",
          Email: data.data.Email || "",
          ContactNumber: data.data.ContactNumber || "",
        });
        setEmail(data.data.Email || ""); // Set email for password reset
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Personal Info Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update Profile
  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const { data } = await axios.put(
        "http://localhost:7500/api/v1/update-user-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(data.message || "Profile updated successfully.");
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  // Password Change Request (Step 1)
  const handlePasswordChangeRequest = async () => {
    setError("");
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setChangingPassword(true);

    try {
      const { data } = await axios.post(
        "http://localhost:7500/api/v1/Password-Change-Request",
        {
          Email: email,
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setMessage(data.msg || "OTP sent to your email");
        setStep(2);
      } else {
        setError(data.msg || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong.");
    } finally {
      setChangingPassword(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    try {
      const { data } = await axios.post(
        "http://localhost:7500/api/v1/resend-otp",
        {
          email,
          type: "password_reset",
        }
      );

      if (data.success) {
        setMessage(data.msg || "OTP resent successfully");
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to resend OTP.");
    }
  };

  // Verify OTP and Change Password (Step 2)
  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:7500/api/v1/verify-otp",
        {
          email,
          otp,
          type: "password_reset",
        }
      );

      if (data.success) {
        setMessage("Password changed successfully!");
        setStep(3);

        // Reset password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
      } else {
        setError(data.message || "OTP verification failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or server error.");
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">My Account</h3>
      </div>

      {/* ====================== PERSONAL INFORMATION ====================== */}
      <div className="border border-gray-300 rounded-2xl overflow-hidden">
        <div className="py-4 px-6 bg-gray-100 border-b border-gray-300 rounded-t-2xl">
          <h5 className="text-gray-800 font-bold">Personal Information</h5>
        </div>
        <div className="px-6 py-6">
          {loading ? (
            <p className="text-center py-8">Loading profile...</p>
          ) : (
            <div className="flex flex-col gap-y-6">
              <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded-[80px] px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div className="relative w-full">
                  <input
                    type="tel"
                    name="ContactNumber"
                    value={formData.ContactNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded-[80px] px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
                <div className="relative w-full">
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-[80px] px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="text-end">
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="bg-green-600 text-white font-semibold py-[11px] px-[22px] rounded-[100px] hover:bg-green-700 transition-colors disabled:opacity-70"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================== PASSWORD CHANGE ====================== */}
      <div className="border border-gray-300 rounded-2xl overflow-hidden">
        <div className="py-4 px-6 bg-gray-100 border-b border-gray-300 rounded-t-2xl">
          <h5 className="text-gray-800 font-bold">Password Change</h5>
        </div>
        <div className="px-6 py-6">
          <div className="flex flex-col gap-y-6">
            {step === 1 && (
              <>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-[80px] px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-[80px] px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-[80px] px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}

                <div className="text-end">
                  <button
                    onClick={handlePasswordChangeRequest}
                    disabled={changingPassword}
                    className="bg-green-600 text-white font-semibold py-[11px] px-[22px] rounded-[100px] hover:bg-green-700 transition-colors disabled:opacity-70"
                  >
                    {changingPassword ? "Processing..." : "Change Password"}
                  </button>
                </div>
              </>
            )}

            {/* OTP Step */}
            {step === 2 && (
              <div className="flex flex-col gap-y-4">
                <p className="text-sm text-gray-600">
                  We've sent an OTP to your email: <strong>{email}</strong>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-[80px] px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  maxLength={6}
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleResendOtp}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Resend OTP
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    className="bg-green-600 text-white font-semibold py-[11px] px-[22px] rounded-[100px] hover:bg-green-700 transition-colors"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === 3 && (
              <div className="text-center py-8">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h4 className="text-xl font-semibold text-gray-800">Password Changed Successfully!</h4>
                <p className="text-gray-600 mt-2">You can now login with your new password.</p>
                <button
                  onClick={() => {
                    setStep(1);
                    setMessage("");
                    setError("");
                  }}
                  className="mt-6 bg-green-600 text-white font-semibold py-3 px-8 rounded-[100px] hover:bg-green-700"
                >
                  Change Password Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDetail;