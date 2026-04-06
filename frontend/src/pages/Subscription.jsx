import { useEffect, useState } from "react";
import api from "../services/api";
import { addNotification } from "../utils/notifications";

export default function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const plans = [
    { planName: "Basic", price: 5, duration: "Monthly" },
    { planName: "Premium", price: 10, duration: "Monthly" },
    { planName: "Pro", price: 50, duration: "Yearly" },
  ];

  const fetchSubscription = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await api.get(`/subscriptions/${userId}`);
      setSubscription(res.data);
    } catch {
      setSubscription(null);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const subRes = await api.post("/subscriptions", {
        planName: plan.planName,
        price: plan.price,
        duration: plan.duration,
      });

      const subscriptionId = subRes.data.subscriptionId;

      await api.post("/payments", {
        subscriptionId,
        amount: plan.price,
        paymentMethod: "Demo Card",
      });

      addNotification({
        title: "Subscription Active",
        message: `Your ${plan.planName} plan is now active.`,
        type: "subscription",
      });

      addNotification({
        title: "Payment Successful",
        message: `Your payment of $${plan.price} was completed.`,
        type: "payment",
      });

      setMessage("Subscription activated successfully!");
      fetchSubscription();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/subscriptions/${subscription.subscriptionId}`);
      setMessage("Subscription cancelled.");
      fetchSubscription();
    } catch (err) {
      console.error(err);
      setError("Cancel failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Subscription Plans</h1>
        <p className="text-slate-500">Choose the best plan for your travel experience.</p>
      </div>

      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {subscription ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Your Plan</h2>
          <p className="mt-2 text-slate-600">Plan: {subscription.planName}</p>
          <p className="text-slate-600">Price: ${subscription.price}</p>
          <p className="text-slate-600">Status: {subscription.subscriptionStatus}</p>

          <button
            onClick={handleCancel}
            className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Cancel Subscription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.planName} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800">{plan.planName}</h2>
              <p className="mt-2 text-3xl font-bold text-sky-600">${plan.price}</p>
              <p className="mt-1 text-slate-500">{plan.duration}</p>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-70"
              >
                {loading ? "Processing..." : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
