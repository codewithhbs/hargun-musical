import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import axios from "axios";

function Settings() {
  const [settings, setSettings] = useState({
    siteName: "",
    siteUrl: "",
    smtp_email: "",
    smtp_password: "",
    supportEmail: "",
    contactNumber: "",
    paymentImage: "",
    socialMediaLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("https://api.hargunmusicals.com/api/v1/admin/settings");
      const data = await response.json();
      console.log(data);
      setSettings(data.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;

    setSettings((prev) => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `https://api.hargunmusicals.com/api/v1/admin/settings/${settings._id}`,
        settings
      );

      console.log(response.data);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Site URL
                </label>
                <input
                  type="url"
                  name="siteUrl"
                  value={settings.siteUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={settings.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Image URL
                </label>
                <input
                  type="url"
                  name="paymentImage"
                  value={settings.paymentImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Image URL"
                />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Email
                </label>
                <input
                  type="email"
                  name="smtp_email"
                  value={settings.smtp_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Password
                </label>
                <input
                  type="password"
                  name="smtp_password"
                  value={settings.smtp_password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Facebook, name: "facebook", color: "text-[#81190B]" },
                { icon: Twitter, name: "twitter", color: "text-blue-400" },
                { icon: Instagram, name: "instagram", color: "text-pink-600" },
                { icon: Linkedin, name: "linkedin", color: "text-blue-700" },
                { icon: Youtube, name: "youtube", color: "text-red-600" },
              ].map(({ icon: Icon, name, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <input
                    type="url"
                    name={name}
                    value={settings.socialMediaLinks[name]}
                    onChange={(e) => handleChange(e, "socialMediaLinks")}
                    placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} URL`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
