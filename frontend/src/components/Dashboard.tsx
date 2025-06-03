// src/components/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "../../api/api"; // Import Axios instance

type Customer = {
  id: string;
  name: string;
  phone: string;
};

type Order = {
  id: string;
  customer_id: string;
  description: string;
  quantity?: number;
  color?: string;
  type?: string;
  logo?: string;
};

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/customers");
        setCustomers(response.data);
      } catch (err) {
        console.error("Failed to load customers:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };

    fetchCustomers();
    fetchOrders();

    console.log("Dashboard component mounted");
    console.log("Customers:", customers);
    console.log("Orders:", orders);
  }, []);

  return (
    <div>
      <h2>📋 Dashboard</h2>

      <h3>👥 Customers</h3>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <strong>{customer.name}</strong> - {customer.phone}
          </li>
        ))}
      </ul>

      <h3>📦 Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <strong>{order.description}</strong> (Customer ID:{" "}
            {order.customer_id})
            {order.quantity && <> - Qty: {order.quantity}</>}
            {order.color && <> - Color: {order.color}</>}
            {order.type && <> - Type: {order.type}</>}
            {order.logo && (
              <img
                src={order.logo}
                alt="Order Logo"
                className="w-48 mt-2 rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
