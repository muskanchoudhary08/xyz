import { useEffect, useState } from "react";
import api from "../services/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments");
        setPayments(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Payment History</h1>
        <p className="text-slate-500">View your recent subscription payments.</p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
          No payments found.
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div key={p.paymentId} className="rounded-2xl bg-white p-5 shadow-sm">
              <p><span className="font-medium">Amount:</span> ${p.amount}</p>
              <p><span className="font-medium">Status:</span> {p.paymentStatus}</p>
              <p><span className="font-medium">Method:</span> {p.paymentMethod}</p>
              <p><span className="font-medium">Reference:</span> {p.transactionReference}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}