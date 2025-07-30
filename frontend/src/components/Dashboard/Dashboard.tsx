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
  CircularProgress,
  Tabs,
  Tab,
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
  const [tab, setTab] = useState(0);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [customerPage, setCustomerPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const limit = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const response = await axios.get("/customers-list", {
          params: { page: customerPage, limit },
        });
        setCustomers(response.data.data);
        setTotalCustomers(response.data.total);
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [customerPage]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await axios.get("/orders", {
          params: { page: orderPage, limit },
        });
        setOrders(response.data.data);
        setTotalOrders(response.data.total);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [orderPage]);

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 4 }}>
        <Tab label="Clientes" />
        <Tab label="Pedidos" />
      </Tabs>

      {tab === 0 && (
        <Paper elevation={2} sx={{ width: "100%", overflowX: "auto" }}>
          <Box minWidth={700}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Nombre</b>
                  </TableCell>
                  <TableCell>
                    <b>Teléfono</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingCustomers ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                    </TableRow>
                  ))
                )}
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
      )}

      {tab === 1 && (
        <Paper elevation={2} sx={{ width: "100%", overflowX: "auto" }}>
          <Box minWidth={900}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Cliente</b>
                  </TableCell>
                  <TableCell>
                    <b>Teléfono</b>
                  </TableCell>
                  <TableCell>
                    <b>Descripción</b>
                  </TableCell>
                  <TableCell>
                    <b>Cantidad</b>
                  </TableCell>
                  <TableCell>
                    <b>Modelo</b>
                  </TableCell>
                  <TableCell>
                    <b>Precio</b>
                  </TableCell>
                  <TableCell>
                    <b>Logo</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingOrders ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
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
                  ))
                )}
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
      )}
    </Box>
  );
}
