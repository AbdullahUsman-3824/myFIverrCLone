import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/apiClient";
import { ORDER_ROUTE } from "../../utils/constants";
import { useStateProvider } from "../../context/StateContext";
import { FiArrowLeft } from "react-icons/fi";

function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state?.orders?.length > 0) {
      setOrders(state.orders);
    } else if (userInfo) {
      const getOrders = async () => {
        try {
          const res = await api.get(ORDER_ROUTE);
          setOrders(res.data.results || []);
        } catch (err) {
          console.error("Failed to fetch buyer orders:", err);
          setOrders([]);
        }
      };
      getOrders();
    }
  }, [state, userInfo]);

  return (
    <div className="min-h-[80vh] pt-28 px-4 md:px-32">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-[#1dbf73] hover:text-green-600 hover:underline transition"
        >
          <FiArrowLeft className="text-base" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Delivery Time</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4 text-center">Send Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 border-b last:border-none transition"
                >
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.gig_title || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    ${order.total_amount || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {order.gig_detail?.delivery_time
                      ? `${order.gig_detail.delivery_time} days`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {order.created_at?.split("T")[0] || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/buyer/orders/${order.id}/messages`)
                      }
                      className="text-[#1dbf73] hover:underline font-medium"
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BuyerOrders;
