import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";

export default function SearchProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Only fetch if query is not empty
    if (query.trim() === "") {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products/search/" + query.trim())
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
          ? res.data.products
          : [];
        setProducts(list);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
        setIsLoading(false);
      });
  }, [query]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-[300px] h-[40px] px-4 mb-4 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="w-full h-full flex flex-wrap justify-center items-center">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {products.map((product) => {
              return <ProductCard key={product.productId} product={product} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}
