import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { sampleProducts } from "../../assets/sampleData.js";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setIsLoading(false);
      });
  }, []);

  function deleteProduct(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete a product");
      return;
    }

    axios
      .delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        toast.success("Product deleted successfully!");
        setIsLoading(true);

        // reload data
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products").then((res) => {
          setProducts(res.data);
          setIsLoading(false);
        });
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Delete failed");
      });
  }

  return (
    <div className="relative w-full h-full bg-primary p-6 overflow-y-auto">

      {/* Floating Add Button */}

      <Link
        to="/admin/add-product"
        className="fixed bottom-8 right-8 bg-accent hover:bg-accent/90 text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
      >
        +
      </Link>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-accent mb-6">Manage Products</h1>

      {isLoading ? (
        /* Loading Spinner */
        <div className="w-full h-[70vh] flex justify-center items-center">
          <div className="w-14 h-14 border-4 border-secondary border-t-accent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4 border border-accent">

          {/* Products Table */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-accent text-white">
              <tr>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Labelled Price</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item, index) => (
                <tr
                  key={item._id || item.productId || index}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 px-4">{item.productId}</td>
                  <td className="py-3 px-4 font-semibold text-secondary">{item.name}</td>
                  <td className="py-3 px-4">
                    <img
                      src={item.images?.[0]}
                      className="w-14 h-14 rounded-md object-cover shadow-sm"
                      alt="product"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.labelPrice}</td>
                  <td className="py-3 px-4 font-bold text-accent">{item.price}</td>
                  <td className="py-3 px-4">{item.stock}</td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => deleteProduct(item.productId)}
                        className="text-red-600 hover:text-red-800 text-xl transition"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() =>
                          navigate("/admin/edit-product", { state: item })
                        }
                        className="text-blue-600 hover:text-blue-800 text-xl transition"
                      >
                        <FaEdit size={18}/>
                      </button>
                    </div>
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
