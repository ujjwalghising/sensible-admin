import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts, deleteProductById, updateProductStock } from "@/services/productService";
import { toast } from "react-hot-toast";
import useStockUpdates from "@/hooks/useStockUpdates"; // Import SSE hook for stock updates

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  // Callback function to handle real-time stock updates
  const handleStockUpdate = (updatedProduct) => {
    setAllProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  // Use the custom hook to listen for real-time stock updates via SSE
  useStockUpdates(handleStockUpdate);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setAllProducts(res.data || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]); // Fetch products when page changes

  // Filter products based on search, category, and stock availability
  const filteredProducts = allProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (categoryFilter ? p.category === categoryFilter : true) &&
        (!inStockOnly || (p.countInStock > 0 && p.countInStock !== undefined))
    );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit
  );
  const totalPages = Math.ceil(filteredProducts.length / limit);

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductById(id);
      toast.success("Product deleted");
      // Remove the deleted product from the UI without full fetch
      setAllProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // Handle stock toggle (mark product in/out of stock)
  const handleToggleStock = async (productId, currentStock, inStock) => {
    const newStock = inStock ? 0 : 1; // Toggle between in stock and out of stock

    setAllProducts((prev) =>
      prev.map((product) =>
        product._id === productId
          ? { ...product, countInStock: newStock, inStock: !inStock }
          : product
      )
    );

    try {
      await updateProductStock(productId, newStock); // Update stock on the server
      toast.success(`Product marked as ${newStock > 0 ? "In Stock" : "Out of Stock"}`);
    } catch (err) {
      toast.error("Failed to update product stock");
      // Revert change if request fails
      setAllProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, countInStock: currentStock, inStock } : product
        )
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/products/create"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 when search changes
          }}
          className="border px-3 py-2 rounded w-full max-w-xs"
        />

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1); // Reset to page 1 when category filter changes
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home</option>
          {/* Add more categories as needed */}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setPage(1); // Reset to page 1 when inStockOnly filter changes
            }}
          />
          In Stock Only
        </label>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Rating</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">${product.price}</td>
                    <td className="px-4 py-2 capitalize">{product.category}</td>
                    <td className="px-4 py-2 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < Math.round(product.rating || 0) ? "★" : "☆"}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-2">
                      {product.countInStock > 0 ? (
                        <span className="text-green-600 font-medium">In Stock</span>
                      ) : (
                        <span className="text-red-500">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                      <button
                        className={`${
                          product.countInStock > 0
                            ? "bg-red-500"
                            : "bg-green-500"
                        } text-white px-3 py-1 text-sm rounded`}
                        onClick={() =>
                          handleToggleStock(
                            product._id,
                            product.countInStock,
                            product.countInStock > 0
                          )
                        }
                      >
                        {product.countInStock > 0
                          ? "Mark as Out of Stock"
                          : "Mark as In Stock"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
