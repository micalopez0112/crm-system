import { useState } from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  direction: string;
  city: string;
  department: string;
  company?: string;
}

const baseURL = (import.meta as any).env.VITE_API_BASE_URL;

export default function CustomerAutocomplete({
  onSelect,
}: {
  onSelect: (customer: Customer) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [searchById, setSearchById] = useState(false);

  const handleQueryChange = async (value: string) => {
    setQuery(value);
    if (!value) return;

    const endpoint = searchById
      ? `${baseURL}/customers?id=${encodeURIComponent(value)}`
      : `${baseURL}/customers?q=${encodeURIComponent(value)}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  return (
    <Stack spacing={1}>
      <Autocomplete
        freeSolo
        filterOptions={(x) => x}
        options={suggestions}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : `${option.name} - ${option.phone} - ${option.email}`
        }
        inputValue={query}
        onInputChange={(e, newInputValue) => {
          setQuery(newInputValue);
          handleQueryChange(newInputValue);
        }}
        onChange={(e, selected) => {
          if (selected && typeof selected !== "string") {
            onSelect(selected);
            setQuery("");
            setSuggestions([]);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Buscar cliente" fullWidth />
        )}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={searchById}
            onChange={(e) => setSearchById(e.target.checked)}
          />
        }
        label="Buscar solo por ID"
      />
    </Stack>
  );
}
