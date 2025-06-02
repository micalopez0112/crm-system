import { useState } from "react";
import axios from "../../api/api";
import CustomerSelector from "./CustomerSelector";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    customer_id: null,
    quantity: 1,
    color: "",
    type: "",
    logo: null, // base64 image or file
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleSelectCustomer = (customer: any) => {
    setFormData((prev) => ({ ...prev, customer_id: customer.id }));
    console.log(customer);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setFormData((prev: any) => ({ ...prev, logo: base64 }));
          setPreview(base64);
        };
        if (file) reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) return alert("Please select a customer!");

    try {
      await axios.post("/orders", formData);
      alert("✅ Order created!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create order.");
    }
  };

  return (
    <form onSubmit={handleSubmit} onPaste={handlePaste}>
      <h2>Create Order</h2>
      <CustomerSelector onSelect={handleSelectCustomer} />

      <input
        name="quantity"
        type="number"
        min="1"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <input
        name="color"
        value={formData.color}
        onChange={handleChange}
        placeholder="Color"
        required
      />
      <input
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Type"
        required
      />

      {preview && (
        <div>
          <p>🖼️ Logo Preview:</p>
          <img
            src={preview}
            alt="Logo preview"
            style={{ width: 100, border: "1px solid #ccc" }}
          />
        </div>
      )}
      <p>
        <small>Paste logo with Ctrl+V</small>
      </p>

      <button type="submit">Create Order</button>
    </form>
  );
}
