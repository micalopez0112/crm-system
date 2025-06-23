// src/components/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "../../../api/api";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Pagination,
} from "@mui/material";

type Customer = {
  id: string;
  name: string;
  phone: string;
};

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  quantity?: number;
  model?: string;
  price?: string;
  description?: string;
  logo?: string;
};

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerPage, setCustomerPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const limit = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/customers-list", {
          params: { page: customerPage, limit },
        });
        setCustomers(response.data.data);
        setTotalCustomers(response.data.total);
      } catch (err) {
        console.error("Failed to load customers:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders", {
          params: { page: orderPage, limit },
        });
        setOrders(response.data.data);
        setTotalOrders(response.data.total);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };

    fetchCustomers();
    fetchOrders();
  }, [customerPage, orderPage]);

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        📋 Dashboard
      </Typography>

      <Typography variant="h5" gutterBottom>
        👥 Customers
      </Typography>
      <Paper elevation={2} sx={{ mb: 4, width: "100%", overflowX: "auto" }}>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Phone</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={Math.ceil(totalCustomers / limit)}
            page={customerPage}
            onChange={(_, value) => setCustomerPage(value)}
          />
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom>
        📦 Orders
      </Typography>
      <Paper elevation={2} sx={{ width: "100%", overflowX: "auto" }}>
        <Box minWidth={900}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Customer</b>
                </TableCell>
                <TableCell>
                  <b>Phone</b>
                </TableCell>
                <TableCell>
                  <b>Description</b>
                </TableCell>
                <TableCell>
                  <b>Qty</b>
                </TableCell>
                <TableCell>
                  <b>Model</b>
                </TableCell>
                <TableCell>
                  <b>Price</b>
                </TableCell>
                <TableCell>
                  <b>Logo</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.description}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.model}</TableCell>
                  <TableCell>{order.price}</TableCell>
                  <TableCell>
                    {order.logo && (
                      <img
                        src={order.logo}
                        alt="Logo"
                        style={{ maxWidth: 80, borderRadius: 4 }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={Math.ceil(totalOrders / limit)}
            page={orderPage}
            onChange={(_, value) => setOrderPage(value)}
          />
        </Box>
      </Paper>
    </Box>
  );
}
