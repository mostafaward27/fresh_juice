import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../types/types';
import { orderService } from '../services/orderService';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  fetchCustomerOrders: (phone: string) => Promise<Order[]>;
  getOrderDetails: (id: string) => Promise<Order | null>;
  placeOrder: (
    customerName: string,
    phone: string,
    address: string,
    items: any[],
    totalPrice: number,
    deliveryFee: number,
    paymentMethod: 'cod' | 'online'
  ) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync orders for admin or if user is loaded
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user]);

  const fetchCustomerOrders = async (phone: string): Promise<Order[]> => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrdersByCustomer(phone);
      return data;
    } catch (err) {
      console.error('Error fetching customer orders', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderDetails = async (id: string): Promise<Order | null> => {
    try {
      return await orderService.getOrderById(id);
    } catch (err) {
      console.error('Error fetching order details', err);
      return null;
    }
  };

  const placeOrder = async (
    customerName: string,
    phone: string,
    address: string,
    items: any[],
    totalPrice: number,
    deliveryFee: number,
    paymentMethod: 'cod' | 'online'
  ): Promise<Order> => {
    setIsLoading(true);
    try {
      const newOrder = await orderService.createOrder({
        customerName,
        phone,
        address,
        items,
        totalPrice,
        deliveryFee,
        status: 'received',
        paymentMethod
      });
      // Refresh local list
      await fetchOrders();
      return newOrder;
    } catch (err) {
      console.error('Error placing order', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
    try {
      const updated = await orderService.updateOrderStatus(id, status);
      // Refresh local list
      await fetchOrders();
      return updated;
    } catch (err) {
      console.error('Error updating order status', err);
      throw err;
    }
  };

  const value = {
    orders,
    isLoading,
    fetchOrders,
    fetchCustomerOrders,
    getOrderDetails,
    placeOrder,
    updateOrderStatus
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
