import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "../../../api/api";

export default function AddCustomer() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    mail: "",
    rut: "",
    razonSocial: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [rawText, setRawText] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/customer", formData);
      alert("Customer created!");
      setFormData({
        nombre: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        departamento: "",
        mail: "",
        rut: "",
        razonSocial: "",
      });
    } catch (err) {
      alert("Error creating customer");
    }
  };

  const handlePasteText = () => {
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const [nombre = "", direccion = "", mail = ""] = lines;

    setFormData((prev) => ({
      ...prev,
      nombre,
      direccion,
      mail,
    }));

    setOpenModal(false);
    setRawText("");
  };

  return (
    <Box
      sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 }, width: "100%" }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          mx: "auto",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Agregar nuevo cliente
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack
            direction="column"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr",
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            <TextField
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{ gridColumn: { sm: "1" } }}
            />
            <TextField
              name="telefono"
              label="Telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              name="razonSocial"
              label="Razon social"
              value={formData.razonSocial}
              onChange={handleChange}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              name="rut"
              label="Rut"
              value={formData.rut}
              onChange={handleChange}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              name="direccion"
              label="Direccion"
              value={formData.direccion}
              onChange={handleChange}
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{ gridColumn: { sm: "span 2" } }}
            />
            <TextField
              name="ciudad"
              label="Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              name="departamento"
              label="Departamento"
              value={formData.departamento}
              onChange={handleChange}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              name="mail"
              label="Mail"
              value={formData.mail}
              onChange={handleChange}
              type="email"
              fullWidth
              size={isMobile ? "small" : "medium"}
            />

            <Stack
              direction="row"
              spacing={2}
              sx={{ gridColumn: { sm: "span 2" }, mt: 1 }}
            >
              <Button
                type="submit"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                sx={{ py: { xs: 1, sm: 1.5 } }}
              >
                Agregar cliente
              </Button>
              <Button
                variant="outlined"
                size={isMobile ? "medium" : "large"}
                onClick={() => setOpenModal(true)}
                sx={{ py: { xs: 1, sm: 1.5 } }}
              >
                Pegar texto
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Pegar datos del cliente</DialogTitle>
        <DialogContent>
          <TextField
            label="Texto del mensaje"
            multiline
            minRows={4}
            fullWidth
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`Ej:\nJoanna Scutari\nCervantes Saavedra 3995\nJoa.th17@gmail.com`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handlePasteText}>
            Cargar datos
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
