import { useState, useEffect } from "react";
import axios from "../../api/api";
import { Customer } from "../models/Customer";

export default function CustomerSelector({ onSelect }) {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (query.length > 1) {
      axios.get("/customers").then((res) => {
        const matches = res.data.filter(
          (c) => c.phone.includes(query) || c.id.toString().includes(query)
        );
        setCustomers(matches);
      });
    } else {
      setCustomers([]);
    }
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by phone or ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {customers.length > 0 && (
        <ul>
          {customers.map((c) => (
            <li key={c.id} onClick={() => onSelect(c)}>
              {c.name} ({c.phone})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
