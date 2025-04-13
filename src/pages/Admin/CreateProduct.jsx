import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createProduct } from "@/services/productService";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    images: [],
    countInStock: "", // Changed to countInStock to match your backend
  });

  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const CLOUDINARY_UPLOAD_PRESET = "sensible-preset";
  const CLOUDINARY_CLOUD_NAME = "ddgydffcg";

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;

    setUploading(true);
    for (const file of acceptedFiles) {
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
        setForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), data.secure_url],
        }));
        setPreviews((prev) => [...prev, data.secure_url]);
      } catch (err) {
        toast.error("Failed to upload image");
      }
    }
    setUploading(false);
  }, []);

  const removeImage = (url) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
    setPreviews((prev) => prev.filter((img) => img !== url));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["countInStock", "price"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      await createProduct(form);
      toast.success("Product created!");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fields */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Product name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
          </select>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Product description"
            className="w-full border px-3 py-2 rounded"
          />
          
          {/* Stock Input */}
          <input
            name="countInStock"
            type="number"
            value={form.countInStock}
            onChange={handleChange}
            required
            placeholder="Stock quantity"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Dropzone */}
          <div>
            <label className="block text-sm font-medium">Upload Images</label>
            <div
              {...getRootProps()}
              className="mt-1 border border-dashed px-3 py-8 rounded text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag & drop or click to select images</p>
              )}
              {uploading && <p className="text-sm mt-2">Uploading...</p>}
            </div>

            {/* Previews */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {previews.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="preview" className="h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-0 right-0 bg-white p-1 rounded-full shadow"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
