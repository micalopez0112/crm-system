import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Checkbox,
  FormControlLabel,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  CircularProgress,
} from "@mui/material";
import axios from "../../../api/api";
import CustomerAutocomplete from "../CustomerAutocomplete/CustomerAutocomplete";

const modelos = ["Tyvek", "Techno", "PVC", "Otras"];

export default function OrderForm() {
  const [formData, setFormData] = useState({
    customer_id: null,
    redes: false,
    cantidad: 0,
    precio: 0,
    modelo: "",
    pedido: "",
    senia: 0,
    producto: null as File | string | null,
  });

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSelectCustomer = (customer: any) => {
    setFormData((prev) => ({ ...prev, customer_id: customer.id }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["cantidad", "precio", "senia"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, producto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setFormData((prev) => ({ ...prev, producto: base64 }));
          setPreview(base64);
        };
        if (file) reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id) return alert("Seleccioná un cliente");

    setLoading(true);
    try {
      await axios.post("/order", {
        customer_id: formData.customer_id,
        redes: formData.redes,
        cantidad: Number(formData.cantidad),
        modelo: formData.modelo,
        precio: Number(formData.precio),
        pedido: formData.pedido,
        senia: Number(formData.senia),
        producto_base64: formData.producto,
      });

      alert("✅ Pedido creado");
    } catch (err) {
      console.error(err);
      alert("❌ Error al crear pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Crear pedido
        </Typography>

        <Box component="form" onSubmit={handleSubmit} onPaste={handlePaste}>
          <Stack
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Box sx={{ gridColumn: "span 2" }}>
              <CustomerAutocomplete onSelect={handleSelectCustomer} />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.redes}
                  onChange={handleChange}
                  name="redes"
                />
              }
              label="¿Es por redes?"
            />

            <TextField
              name="cantidad"
              label="Cantidad"
              type="number"
              inputProps={{ min: 1 }}
              value={formData.cantidad}
              onChange={handleChange}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
            />

            <TextField
              name="precio"
              label="Precio unitario"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
            />

            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Modelo</InputLabel>
              <Select
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
              >
                {modelos.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="pedido"
              label="Pedido"
              value={formData.pedido}
              onChange={handleChange}
              multiline
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{ gridColumn: { sm: "span 1" } }}
            />

            <TextField
              name="senia"
              label="Seña"
              type="number"
              value={formData.senia}
              onChange={handleChange}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />

            {/* <Box sx={{ gridColumn: "span 2" }}>
              <Button component="label" variant="outlined">
                Subir imagen del producto
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                También podés pegar con <strong>Ctrl+V</strong>
              </Typography>

              {preview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Vista previa:
                  </Typography>
                  <img
                    src={preview}
                    alt="Vista previa"
                    style={{
                      width: 120,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />
                </Box>
              )}
            </Box> */}

            <Box sx={{ gridColumn: "span 2", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                sx={{ py: { xs: 1, sm: 1.5 } }}
                disabled={loading}
              >
                {loading ? "Creando pedido..." : "Crear pedido"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
