// src/components/Dashboard.tsx
import { useEffect, useState } from "react";

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
    fetch("http://localhost:8000/customers")
      .then((res) => res.json())
      .then(setCustomers)
      .catch((err) => console.error("Failed to load customers:", err));

    fetch("http://localhost:8000/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error("Failed to load orders:", err));

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
