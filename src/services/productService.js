// src/services/productService.js
import axios from "@/utils/axios";

export const getAllProducts = () => axios.get("/api/products");
export const deleteProductById = (id) => axios.delete(`/api/products/${id}`);
export const updateProductById = (id, data) => axios.put(`/api/products/${id}`, data);
export const createProduct = (data) => axios.post("/api/products/add", data);
export const getProductById = (id) => axios.get(`/api/products/${id}`);

export const updateProductStock = async (productId, stockAmount) => {
  try {
    const response = await axios.patch(
      `/api/products/${productId}/update-stock`,
      { stock: stockAmount }
    );

    return response.data;  // Return the updated product information
  } catch (error) {
    console.error("Error updating stock:", error);
    throw new Error("Failed to update stock");
  }
};
