import React, { useRef, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { PrintableLabel } from "../PrintableLabel/PrintableLabel";

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

const TagPrint: React.FC = () => {
  const [query, setQuery] = useState("");
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

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
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=900");

    if (printWindow) {
      printWindow.document.write(`
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            box-sizing: border-box;
          }

          .print-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            padding: 10mm;
            height: 100%;
            box-sizing: border-box;
            page-break-after: always;
          }

          .print-label {
            border: 1px solid black;
            display: flex;
            box-sizing: border-box;
            page-break-inside: avoid;
            height: 9.5cm; /* adjust to fit 2 per row vertically */
            width: 100%; /* ensures full width inside each grid cell */
          }

          .label-column {
            background: red;
            color: white;
            writing-mode: vertical-rl;
            text-align: center;
            font-weight: bold;
            font-size: 40px;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .label-content {
            padding: 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 20px;
          }

          .footer {
            font-size: 20px;
            text-align: center;
            margin-top: 10px;
            color: red;
          }
        </style>

      `);

      printWindow.document.write("</head><body>");
      printWindow.document.write(printContents);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto", px: 2 }}>
      <Box className="hide-printing" mt={4}>
        <Typography variant="h5" gutterBottom>
          Add Clients to Print
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Name, email, or phone"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="contained" disabled={!query} onClick={fetchCustomer}>
            Add Client
          </Button>
        </Stack>
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>

      {customerList.length > 0 && (
        <>
          <Box className="hide-printing" mb={2}>
            <Button variant="outlined" onClick={handlePrint}>
              Print Labels
            </Button>
          </Box>

          <Stack
            direction="row"
            flexWrap="wrap"
            spacing={2}
            useFlexGap
            className="print-container"
          >
            {customerList.map((c, index) => (
              <Card
                key={index}
                className="print-card"
                variant="outlined"
                sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}
              >
                <CardContent>
                  <TextField
                    label="Nombre"
                    value={c.name}
                    fullWidth
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TextField
                    label="Dirección"
                    value={c.direction}
                    fullWidth
                    onChange={(e) =>
                      handleInputChange(index, "direction", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    label="Ciudad"
                    value={c.city}
                    fullWidth
                    onChange={(e) =>
                      handleInputChange(index, "city", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    label="Departamento"
                    value={c.department}
                    fullWidth
                    onChange={(e) =>
                      handleInputChange(index, "department", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                </CardContent>
                <CardActions className="hide-printing">
                  <IconButton
                    color="error"
                    onClick={() => removeCustomer(c.phone)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Stack>

          <div style={{ display: "none" }}>
            <PrintableLabel ref={printRef} customers={customerList} />
          </div>
        </>
      )}
    </Box>
  );
};

export default TagPrint;
