import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    if (isLoading) {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view orders");
        return;
      }

      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setOrders(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(
            "Failed to load orders:",
            err.response?.data?.message || err.message
          );
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  // Set appElement for accessibility (required by react-modal)
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  // Status badge classes
  function getStatusClass(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "processing":
        return "bg-blue-200 text-blue-800";
      case "shipped":
        return "bg-purple-200 text-purple-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  }

  return (
    <div className="w-full h-full bg-primary p-6 overflow-y-auto">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-accent mb-6">Manage Orders</h1>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-10 p-6 outline-none"
        overlayClassName="fixed inset-0 bg-[#00000040] flex justify-center items-center"
      >
        {activeOrder && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--color-accent)]">
              Order Details - {activeOrder.orderId}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Name:</span> {activeOrder.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {activeOrder.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {activeOrder.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {activeOrder.address}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`ml-2 font-bold ${
                      activeOrder.status === "pending"
                        ? "text-yellow-500"
                        : activeOrder.status === "completed"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {String(activeOrder.status || "").toUpperCase()}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {new Date(activeOrder.date).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <span className="font-semibold">Total:</span> {(activeOrder.total || 0).toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                </p>
                {typeof activeOrder.labelledTotal !== "undefined" && (
                  <p>
                    <span className="font-semibold">Labelled Total:</span> {activeOrder.labelledTotal.toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                  </p>
                )}
              </div>
            </div>

            {Array.isArray(activeOrder.products) && (
              <>
                <h3 className="text-xl font-semibold mt-4">Products</h3>
                <table className="w-full text-center border border-gray-200 shadow rounded">
                  <thead className="bg-[var(--color-accent)] text-white">
                    <tr>
                      <th className="py-2 px-2">Image</th>
                      <th className="py-2 px-2">Product</th>
                      <th className="py-2 px-2">Price</th>
                      <th className="py-2 px-2">Quantity</th>
                      <th className="py-2 px-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOrder.products.map((item, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? "bg-[var(--color-primary)]" : "bg-gray-100"}`}>
                        <td className="py-2 px-2">
                          <img
                            src={item.productInfo?.images?.[0]}
                            alt={item.productInfo?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="py-2 px-2">{item.productInfo?.name}</td>
                        <td className="py-2 px-2">
                          {(item.productInfo?.price || 0).toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                        </td>
                        <td className="py-2 px-2">{item.quantity}</td>
                        <td className="py-2 px-2">
                          {((item.productInfo?.price || 0) * (item.quantity || 0)).toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-secondary)] transition"
              >
                Print
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto bg-white border border-accent shadow-md rounded-xl p-4">

          {/* Orders Table */}
          <table className="w-full border-collapse">
            <thead className="bg-accent text-white">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    setActiveOrder(order);
                    setIsModalOpen(true);
                  }}
                >
                  <td className="py-3 px-4">{order.orderId}</td>
                  <td className="py-3 px-4">{order.name}</td>
                  <td className="py-3 px-4">{order.email}</td>
                  <td className="py-3 px-4">{order.address}</td>
                  <td className="py-3 px-4">{order.phone}</td>
                  <td className="py-3 px-4 font-semibold text-accent">
                    {order.total?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        "px-3 py-1 rounded-full text-sm font-semibold capitalize " +
                        getStatusClass(order.status)
                      }
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
