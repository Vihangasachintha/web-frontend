import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider.jsx";
import Loading from "../../components/loading.jsx";
import "./style.css";

export default function ProductOverviewPage() {
  const params = useParams();
  const productId = params.id;
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!productId) return;
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
        setStatus("success");
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
        toast.error("Error fetching product details");
      });
  }, [productId]);

  return (
    <>
      {status === "success" && (
        <div className="w-full h-full flex">
          <div className="w-[50%] h-full flex justify-center items-center">
            <ImageSlider images={product.images} />
          </div>
          <div className="w-[50%] flex justify-center items-center h-full">
            <div className="w-[500px] h-[600px]">
              <h1 className="w-full text-center text-2xl text-secondary font-semibold">
                {product.name}
                {product.altNames.map((altName, index) => {
                  return (
                    <span key={index} className="text-2xl text-gray-600">
                      {" | " + altName}
                    </span>
                  );
                })}
              </h1>
              <h1 className="w-full text-center my-2 text-md text-gray-600 font-semibold">
                {product.productId}
              </h1>
              <p className="w-full text-center my-2 text-md text-gray-600 font-semibold">
                {product.description}
              </p>
              {product.labelPrice > product.price ? (
                <div className="flex justify-center">
                  <span className="text-4xl mx-4 text-gray-500 line-through">
                    {product.labelPrice.toFixed(2)}{" "}
                  </span>
                  <span className="text-4xl mx-4 font-bold text-accent">
                    {product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-4xl mx-4 font-bold text-accent flex justify-center">
                  {product.price.toFixed(2)}
                </span>
              )}
              <div className="w-full flex justify-center mt-4">
                <button className="w-[200px] h-[50px] bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300 mx-4">
                  Add to Cart
                </button>
                <button className="w-[200px] h-[50px] bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300 mx-4">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {status === "loading" && <Loading />}
    </>
  );
}
