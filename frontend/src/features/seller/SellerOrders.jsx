import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useAuth } from "../../context/AuthContext";

const SellerOrders = () => {
  // const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy orders data
    const dummyOrders = [
      {
        _id: "order1",
        gig: { title: "Logo Design" },
        amount: 100,
        createdAt: new Date().toISOString(),
        buyer: { username: "john_doe" },
        status: "pending"
      },
      {
        _id: "order2",
        gig: { title: "Website Development" },
        amount: 500,
        createdAt: new Date().toISOString(),
        buyer: { username: "jane_smith" },
        status: "in_progress"
      },
      {
        _id: "order3",
        gig: { title: "SEO Optimization" },
        amount: 150,
        createdAt: new Date().toISOString(),
        buyer: { username: "mike_lee" },
        status: "completed"
      }
    ];
  
    // Simulate loading then set dummy data
    setTimeout(() => {
      setOrders(dummyOrders);
      setLoading(false);
    }, 1000);
  }, []);  

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `/api/seller/orders/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // if (!user) {
  //   return <div>Please login to view this page</div>;
  // }

  // if (loading) {
  //   return <div>Loading orders...</div>;
  // }

  return (
    <div className="min-h-[80vh] my-10 pt-5 px-8 md:px-32">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{order.gig.title}</h2>
                  <p className="text-gray-600">Order ID: {order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${order.amount}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Buyer: {order.buyer.username}</p>
                    <p className="text-gray-600">Status: {order.status}</p>
                  </div>
                  <div className="space-x-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, "in_progress")}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Start Work
                        </button>
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, "cancelled")}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "in_progress" && (
                      <button
                        onClick={() => handleOrderStatusUpdate(order._id, "completed")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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