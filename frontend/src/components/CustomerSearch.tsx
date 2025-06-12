import React, { useState } from "react";
import "./CustomerSearch.css";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  direction: string;
  city: string;
  department: string;
}

const baseURL = (import.meta as any).env.VITE_API_BASE_URL;

const CustomerSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [error, setError] = useState("");

  const fetchCustomer = async () => {
    setError("");
    try {
      const res = await fetch(
        `${baseURL}/customers?q=${encodeURIComponent(query)}`
      );
      const data: Customer[] = await res.json();
      if (data.length === 0) {
        setError("Customer not found.");
        return;
      }

      const newCustomer = data[0];
      const alreadyAdded = customerList.find(
        (c) => c.phone === newCustomer.phone
      );
      if (!alreadyAdded) {
        setCustomerList((prev) => [...prev, newCustomer]);
        setQuery("");
      } else {
        setError("Customer already added.");
      }
    } catch (err) {
      setError("Error fetching customer.");
    }
  };

  const removeCustomer = (phone: string) => {
    setCustomerList((prev) => prev.filter((c) => c.phone !== phone));
  };

  const handleInputChange = (
    index: number,
    field: keyof Pick<Customer, "name" | "direction" | "city" | "department">,
    value: string
  ) => {
    const updatedList = [...customerList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    setCustomerList(updatedList);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container">
      <h2 className="hide-printing">Add Clients to Print</h2>
      <input
        type="text"
        placeholder="Name, email, or phone"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="hide-printing"
      />
      <button
        onClick={fetchCustomer}
        disabled={!query}
        className="hide-printing"
      >
        Add Client
      </button>
      {error && <p className="error hide-printing">{error}</p>}

      {customerList.length > 0 && (
        <>
          <button onClick={handlePrint} className="print-btn hide-printing">
            Print Labels
          </button>
          <div className="print-container">
            {customerList.map((c, index) => (
              <div className="print-card" key={index}>
                <div className="card-info">
                  <strong>Nombre:</strong>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="card-info">
                  <strong>Dirección:</strong>
                  <input
                    type="text"
                    value={c.direction}
                    onChange={(e) =>
                      handleInputChange(index, "direction", e.target.value)
                    }
                  />
                </div>
                <div className="card-info">
                  <strong>Ciudad:</strong>
                  <input
                    type="text"
                    value={c.city}
                    onChange={(e) =>
                      handleInputChange(index, "city", e.target.value)
                    }
                  />
                </div>
                <div className="card-info">
                  <strong>Departamento:</strong>
                  <input
                    type="text"
                    value={c.department}
                    onChange={(e) =>
                      handleInputChange(index, "department", e.target.value)
                    }
                  />
                </div>
                <button
                  onClick={() => removeCustomer(c.phone)}
                  className="hide-printing"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSearch;
