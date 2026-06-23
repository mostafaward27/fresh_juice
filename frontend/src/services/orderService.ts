import type { Order, OrderStatus } from '../types/types';
import api from './api';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  getOrdersByCustomer: async (phone: string): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/customer/${phone}`);
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const response = await api.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch order ${id}`, error);
      return null;
    }
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery'>): Promise<Order> => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }
};
