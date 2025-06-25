import { useEffect, useState } from "react";
import api from "../../../utils/apiClient";
import { ORDER_ROUTE } from "../../../utils/constants";
import { useStateProvider } from "../../../context/StateContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { FiArrowLeft } from "react-icons/fi";

const SellerOrders = () => {
  const navigate = useNavigate();
  const [{ userInfo }] = useStateProvider();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const response = await api.get(ORDER_ROUTE);
        setOrders(response.data.results);
      } catch (error) {
        console.error("Failed to fetch seller orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await api.put(`${ORDER_ROUTE}${orderId}/`, {
        status: newStatus,
      });
      if (response.status === 200) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] mt-24 pt-5 px-4 md:px-32">
      {/* Go Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 inline-flex items-center gap-2 text-[#404145] hover:text-black transition font-medium"
      >
        <FiArrowLeft />
        <span>Go Back</span>
      </button>

      <h1 className="text-2xl font-bold text-[#222] mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#404145]">
                    {order.gig_title || "Untitled Gig"}
                  </h2>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#404145]">
                    ${order.total_amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <p className="text-gray-600">
                      Buyer:{" "}
                      <span className="font-medium text-[#404145]">
                        {order.buyer_username || "Unknown"}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Status:{" "}
                      <span className="capitalize font-semibold">
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {order.status === "placed" && (
                      <>
                        <button
                          onClick={() =>
                            handleOrderStatusUpdate(order.id, "in_progress")
                          }
                          className="bg-[#404145] text-white px-4 py-2 rounded hover:bg-[#2c2c2d] transition"
                        >
                          Start Work
                        </button>
                        <button
                          onClick={() =>
                            handleOrderStatusUpdate(order.id, "cancelled")
                          }
                          className="border border-[#404145] text-[#404145] px-4 py-2 rounded hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "in_progress" && (
                      <button
                        onClick={() =>
                          handleOrderStatusUpdate(order.id, "completed")
                        }
                        className="bg-[#1dbf73] text-white px-4 py-2 rounded hover:bg-[#19a463] transition"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
