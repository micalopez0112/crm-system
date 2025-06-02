import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerForm from "../src/components/CustomerForm.tsx";
import OrderForm from "../src/components/OrderForm";
import Dashboard from "../src/components/Dashboard"; // 👈 Import

import "./App.css";

function App() {
  return (
    <Router>
      <div className="p-4">
        <h1>🧾 CRM System</h1>

        {/* Navigation Menu */}
        <nav style={{ margin: "1rem 0" }}>
          <Link to="/customer" style={{ marginRight: 10 }}>
            Add Customer
          </Link>
          <Link to="/order" style={{ marginRight: 10 }}>
            Create Order
          </Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        {/* Page Content */}
        <Routes>
          <Route path="/customer" element={<CustomerForm />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
