import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../components/loading";
import Modal from "react-modal";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const columnWidths = [120, 160, 120, 130, 220, 120, 140, 140];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setOrders(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert("Error fetching orders: " + (err.response?.data?.message || "unknown error"));
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full h-full overflow-y-scroll p-6">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          {/* ORDER DETAILS MODAL */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                zIndex: 50,
              },
              content: {
                position: "static",
                padding: "0",
                borderRadius: "18px",
                maxWidth: "760px",
                width: "100%",
                border: "none",
                inset: "unset",
              },
            }}
          >
            {activeOrder && (
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-600">
                    Order #{activeOrder.orderId}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeOrder.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : activeOrder.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : activeOrder.status === "Returned"
                          ? "bg-blue-200 text-blue-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {activeOrder.status.toUpperCase()}
                  </span>
                  <select defaultValue="" onChange={async(e) => {
                    const updatedValue = e.target.value
                    try{
                    const token = localStorage.getItem("token");
                    await axios.put(
                      import.meta.env.VITE_BACKEND_URL + 
                      "/api/orders/" + 
                      activeOrder.orderId + 
                      "/" + 
                      updatedValue ,
                      {},
                      {
                        headers: { 
                          Authorization: "Bearer " + token },
                      }
                    );

                    setIsModalOpen(false);
                    setIsLoading(true);

                    const res = await axios.get(
                      import.meta.env.VITE_BACKEND_URL + "/api/orders",
                      {
                        headers: {
                          Authorization: "Bearer " + token,
                        },
                      }
                      );
                      setOrders(res.data);
                      setIsLoading(false);
                    
                    }catch(e){
                      toast.error("Failed to update order status")
                      console.log(e)
                    }
                  }}>
                    <option value="" disabled>Change Status</option>
                    <option className="bg-yellow-500" value="Pending">Pending</option>
                    <option className="bg-green-500" value="Completed">Completed</option>
                    <option className="bg-red-500" value="Canceled">Canceled</option>
                    <option className="bg-blue-500" value="Returned">Returned</option>

                  </select>
                  
                </div>

                {/* Customer Info */}
                <div className="border p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                  <p><strong>Name:</strong> {activeOrder.name}</p>
                  <p><strong>Email:</strong> {activeOrder.email}</p>
                  <p><strong>Phone:</strong> {activeOrder.phone}</p>
                  <p><strong>Address:</strong> {activeOrder.address}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(activeOrder.date).toLocaleString()}
                  </p>
                </div>

                {/* Ordered Products */}
                <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>

                {/* Scroll ONLY when many products */}
                <div className="max-h-44 overflow-y-auto pr-1">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-sm sticky top-0 z-10">
                        <th className="text-left py-2">Product</th>
                        <th className="py-2">Qty</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {activeOrder.products?.map((product) => (
                        <tr key={product._id} className="border-b">
                          <td className="py-3 flex items-center gap-3">
                            <div className="w-14 h-14 border rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                              <img
                                src={product.productInfo?.images?.[0]}
                                alt={product.productInfo?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {product.productInfo?.name}
                            </span>
                          </td>

                          <td className="text-center">{product.quantity}</td>

                          <td className="text-center text-green-600 font-semibold">
                            Rs.{product.productInfo?.price.toFixed(2)}
                          </td>

                          <td className="text-center font-semibold">
                            Rs.{(product.quantity * product.productInfo?.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <hr className="my-5" />

                {/* Order Total */}
                <div className="text-right text-xl font-bold text-pink-600 mb-3">
                  Order Total: ${activeOrder.total.toFixed(2)}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 mt-2">
                  <button
                    className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg text-lg font-semibold hover:bg-gray-400 transition"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>

                  <button
                    className="flex-1 bg-pink-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-pink-600 transition"
                    onClick={() => window.print()}
                  >
                    Print
                  </button>
                </div>

              </div>
            )}
          </Modal>

          {/* ORDERS TABLE */}
          <table
            className="w-full border-collapse shadow-lg rounded-lg overflow-hidden"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              {columnWidths.map((width, index) => (
                <col key={index} style={{ width: `${width}px` }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-accent text-white">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-2 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  onClick={() => {
                    setActiveOrder(order);
                    setIsModalOpen(true);
                  }}
                  className={`cursor-pointer hover:bg-pink-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{order.orderId}</td>
                  <td className="px-2 py-3">{order.name}</td>
                  <td
                    className="px-4 py-3"
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {order.email}
                  </td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td
                    className="px-4 py-3"
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {order.address}
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    Rs.{order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : order.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : order.status === "Returned"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
