import { useState } from "react";
import axios from "../../api/api";

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/customers", formData);
      alert("Customer created!");
      setFormData({ name: "", phone: "", email: "" });
    } catch (err) {
      alert("Error creating customer");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Add Customer</button>
    </form>
  );
}
