import apiClient from "@/utils/apiClient";
import { BASE_URL } from "@/utils/constants.jsx";

const productApi = {
  getProductList: () => apiClient.get(`${BASE_URL}/v1/products/all-products`),

  getProductListPaging: (page, size) => apiClient.get(`${BASE_URL}/v1/products/list-products-paging?page=${page}&size=${size}`),

  createProduct: (productRequest) => apiClient.post(`${BASE_URL}/v1/products/create`, productRequest),

  updateProduct: (productRequest) => apiClient.put(`${BASE_URL}/v1/products/update/${productRequest.id}`, productRequest),

  changeStatus: (id) => apiClient.put(`${BASE_URL}/v1/products/${id}/status`),
}

export default productApi;