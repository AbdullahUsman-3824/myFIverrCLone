import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GET_BUYER_ORDERS_ROUTE } from "../../utils/constants";
import { useStateProvider } from "../../context/StateContext";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const {
          data: { orders },
        } = await axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true });
  
        // If real orders are returned, use them
        if (orders && orders.length > 0) {
          setOrders(orders);
        } else {
          // Else set dummy orders
          setOrders(dummyOrders);
        }
      } catch (err) {
        console.error(err);
        // On error, also load dummy orders
        setOrders(dummyOrders);
      }
    };
  
    const dummyOrders = [
      {
        id: "ORD001",
        gig: {
          title: "Logo Design",
          category: "Design",
          deliveryTime: "3 Days",
        },
        price: "$50",
        createdAt: "2025-05-20T10:30:00Z",
      },
      {
        id: "ORD002",
        gig: {
          title: "SEO Optimization",
          category: "Marketing",
          deliveryTime: "5 Days",
        },
        price: "$75",
        createdAt: "2025-05-19T14:15:00Z",
      },
      {
        id: "ORD003",
        gig: {
          title: "Website Development",
          category: "Programming",
          deliveryTime: "10 Days",
        },
        price: "$300",
        createdAt: "2025-05-18T08:00:00Z",
      },
    ];
  
    if (userInfo) getOrders();
  }, [userInfo]);
  

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Orders</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Send Message
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={order.id}
                >
                  <th scope="row" className="px-6 py-4 ">
                    {order.id}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {order.gig.title}
                  </th>
                  <td className="px-6 py-4">{order.gig.category}</td>
                  <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">{order.gig.deliveryTime}</td>
                  <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>
                  <td className="px-6 py-4 ">
                    <button
                      onClick={() => navigate(`/buyer/orders/${order.id}/messages`)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Send
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders; 