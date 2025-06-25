import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../utils/apiClient";
import { ORDER_ROUTE } from "../../../utils/constants";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gig, selectedPackage } = location.state || {};

  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!gig || !selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">
          No gig selected for payment.
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name on card is required";
    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, "")))
      errs.cardNumber = "Card number must be 16 digits";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry))
      errs.expiry = "Expiry must be MM/YY";
    if (!/^\d{3,4}$/.test(form.cvv)) errs.cvv = "CVV must be 3 or 4 digits";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const placeOrder = async () => {
    const orderData = {
      gig: gig?.id,
      package: selectedPackage?.id,
      description: "order description",
      total_amount: selectedPackage?.price,
    };
    try {
      const res = await api.post(ORDER_ROUTE, orderData);

      navigate("/dashoard");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Payment successful! (Demo only)");
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Order Summary */}
        <div className="md:w-1/2 p-8 bg-gray-50 border-r border-gray-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="mb-4">
              <div className="font-semibold text-gray-700 mb-1">
                {gig.title}
              </div>
              <div className="text-gray-500 text-sm mb-2">
                {gig.description?.slice(0, 80)}...
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Package:</span>
                <span className="font-medium">
                  {selectedPackage.package_name}
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Delivery:</span>
                <span>{selectedPackage.delivery_days} days</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Revisions:</span>
                <span>{selectedPackage.number_of_revisions}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-4 mt-4">
              <span>Total</span>
              <span className="text-green-600">${selectedPackage.price}</span>
            </div>
          </div>
          <div className="mt-8 text-xs text-gray-400">
            This is a demo payment page. No real payment will be processed.
          </div>
        </div>
        {/* Payment Form */}
        <form
          className="md:w-1/2 p-8 flex flex-col justify-center"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Pay with Card
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Name on Card
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Full Name"
            />
            {errors.name && (
              <div className="text-red-500 text-xs mt-1">{errors.name}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              maxLength={19}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.cardNumber ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
            />
            {errors.cardNumber && (
              <div className="text-red-500 text-xs mt-1">
                {errors.cardNumber}
              </div>
            )}
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                Expiry
              </label>
              <input
                type="text"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                maxLength={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.expiry ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="MM/YY"
                inputMode="numeric"
              />
              {errors.expiry && (
                <div className="text-red-500 text-xs mt-1">{errors.expiry}</div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                CVV
              </label>
              <input
                type="password"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                maxLength={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.cvv ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="123"
                inputMode="numeric"
              />
              {errors.cvv && (
                <div className="text-red-500 text-xs mt-1">{errors.cvv}</div>
              )}
            </div>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={placeOrder}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-2 disabled:opacity-60"
          >
            {submitting ? "Processing..." : `Pay $${selectedPackage.price}`}
          </button>
          <button
            type="button"
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
