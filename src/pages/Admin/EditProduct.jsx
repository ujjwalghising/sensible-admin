import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProductById } from "@/services/productService";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    quantity: 1,
    countInStock: 1,  // Updated to use countInStock
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_UPLOAD_PRESET = "sensible-preset";
  const CLOUDINARY_CLOUD_NAME = "ddgydffcg";

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  // Upload image
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, data.secure_url],
      }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Delete image
  const removeImage = (urlToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
  };

  // Form handlers
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProductById(id, product);
      toast.success("Product updated!");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
        />

        {/* Stock Input */}
        <input
          type="number"
          name="countInStock"  // Updated to countInStock
          value={product.countInStock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border px-4 py-2 rounded"
        />

        {/* Dropzone */}
        <div>
          <label className="block text-sm font-medium">Upload Images</label>
          <div
            {...getRootProps()}
            className="mt-1 border border-dashed px-3 py-8 rounded text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>Drag & drop or click to select image</p>
            {uploading && <p className="text-sm mt-2">Uploading...</p>}
          </div>

          {/* Preview */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {product.images.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="rounded h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
