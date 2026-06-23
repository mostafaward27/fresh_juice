import type { Product } from '../types/types';
import api from './api';

export const productService = {
  getProducts: async (category?: string, search?: string): Promise<Product[]> => {
    let url = '/products';
    const params: string[] = [];

    if (category) {
      params.push(`category=${category}`);
    }
    if (search) {
      params.push(`q=${search}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const response = await api.get<Product[]>(url);
    return response.data;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}`, error);
      return null;
    }
  },

  createProduct: async (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>): Promise<Product> => {
    const response = await api.post<Product>('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await api.delete(`/products/${id}`);
    return true;
  },

  uploadImage: async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post<{ imageUrl: string }>('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.imageUrl;
  }
};
