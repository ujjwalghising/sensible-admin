import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    welcomeMessage: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/settings")
      .then((res) => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put("/admin/settings", settings)
      .then((res) => {
        toast.success("Settings updated!");
      })
      .catch(() => {
        toast.error("Failed to update settings");
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
          />
          <label>Maintenance Mode</label>
        </div>

        <div>
          <label className="block mb-1">Welcome Message</label>
          <input
            type="text"
            name="welcomeMessage"
            value={settings.welcomeMessage}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
