import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Stack,
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

  return (
    <Paper elevation={3} sx={{ p: 5, width: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Agregar nuevo cliente
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="telefono"
            label="Telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="direccion"
            label="Direccion"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="ciudad"
            label="Ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="departamento"
            label="Departamento"
            value={formData.departamento}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="mail"
            label="Mail"
            value={formData.mail}
            onChange={handleChange}
            type="email"
            fullWidth
          />
          <TextField
            name="rut"
            label="Rut"
            value={formData.rut}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="razonSocial"
            label="Razon social"
            value={formData.razonSocial}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large">
            Agregar cliente
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
