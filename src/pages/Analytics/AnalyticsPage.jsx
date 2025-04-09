// src/pages/Analytics/AnalyticsPage.jsx
import { useEffect, useState } from "react";
import { getAnalytics } from "@/services/adminServices";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading analytics...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      {analytics ? (
        <div className="space-y-4">
          <p><strong>Total Users:</strong> {analytics.totalUsers}</p>
          <p><strong>Total Orders:</strong> {analytics.totalOrders}</p>
          <p><strong>Total Revenue:</strong> ${analytics.totalRevenue}</p>
        </div>
      ) : (
        <p className="text-red-500">Failed to load analytics data.</p>
      )}
    </div>
  );
}
