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
import CustomerAutocomplete from "../CustomerAutocomplete/CustomerAutocomplete.tsx";
import { Customer } from "../../models/Customer.tsx";

const TagPrint: React.FC = () => {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const addCustomer = (customer: Customer) => {
    setError("");
    const alreadyAdded = customerList.find((c) => c.phone === customer.phone);
    if (!alreadyAdded) {
      setCustomerList((prev) => [...prev, customer]);
    } else {
      setError("Customer already added.");
    }
  };

  const removeCustomer = (phone: string) => {
    setCustomerList((prev) => prev.filter((c) => c.phone !== phone));
  };

  const handleInputChange = (
    index: number,
    field: keyof Pick<
      Customer,
      | "name"
      | "direction"
      | "city"
      | "department"
      | "email"
      | "phone"
      | "company"
    >,
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
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; box-sizing: border-box; }
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
            height: 9.5cm;
            width: 100%;
          }

          .print-label:nth-child(1) { grid-column: 2; grid-row: 1; }
          .print-label:nth-child(2) { grid-column: 2; grid-row: 2; }
          .print-label:nth-child(3) { grid-column: 1; grid-row: 1; }
          .print-label:nth-child(4) { grid-column: 1; grid-row: 2; }

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
          Agregar clientes para imprimir etiquetas
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <CustomerAutocomplete onSelect={addCustomer} />
        </Stack>

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>

      {customerList.length > 0 && (
        <>
          <Box className="hide-printing" mb={2} mt={2}>
            <Button variant="outlined" onClick={handlePrint}>
              Imprimir etiquetas
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
                    label="Empresa"
                    value={c.company}
                    fullWidth
                    onChange={(e) =>
                      handleInputChange(index, "company", e.target.value)
                    }
                    sx={{ mt: 2 }}
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
                    label="Teléfono"
                    value={c.phone}
                    fullWidth
                    onChange={(e) =>
                      handleInputChange(index, "phone", e.target.value)
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
