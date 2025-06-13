import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
} from "@mui/material";

import OrderForm from "../src/components/OrderForm";
import Dashboard from "../src/components/Dashboard";
import TagPrint from "./components/LabelsPrint/LabelsPrint.tsx";
import AddCustomer from "./components/AddCustomer/AddCustomer.tsx";

const drawerWidth = 240;

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              CRM Publiadhesivos
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Left-side Drawer */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItemButton component={RouterLink} to="/customer">
                <ListItemText primary="Add Customer" />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/order">
                <ListItemText primary="Create Order" />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/printTag">
                <ListItemText primary="Imprimir etiqueta" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          <Toolbar /> {/* Space for the AppBar */}
          <Routes>
            <Route path="/customer" element={<AddCustomer />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/printTag" element={<TagPrint />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
