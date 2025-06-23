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
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

import OrderForm from "./components/AddOrder/OrderForm.tsx";
import Dashboard from "../src/components/Dashboard/Dashboard.tsx";
import TagPrint from "./components/PrintLabels/PrintLabels.tsx";
import AddCustomer from "./components/AddCustomer/AddCustomer.tsx";

const drawerWidth = 240;

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItemButton component={RouterLink} to="/customer">
          <ListItemText primary="Agregar Cliente" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/printTag">
          <ListItemText primary="Imprimir etiqueta" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/order">
          <ListItemText primary="Crear Pedido" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div">
              CRM Publiadhesivos
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="sidebar navigation"
        >
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
            >
              {drawer}
            </Drawer>
          ) : (
            <Drawer
              variant="permanent"
              sx={{
                [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          )}
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
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
