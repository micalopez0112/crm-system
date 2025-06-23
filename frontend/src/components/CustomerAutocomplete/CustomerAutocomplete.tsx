import { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Box,
} from "@mui/material";
import { Customer } from "../../models/Customer";

const baseURL = (import.meta as any).env.VITE_API_BASE_URL;

export default function CustomerAutocomplete({
  onSelect,
}: {
  onSelect: (customer: Customer) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [searchById, setSearchById] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const endpoint = searchById
        ? `${baseURL}/customers?id=${encodeURIComponent(query)}`
        : `${baseURL}/customers?q=${encodeURIComponent(query)}`;

      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 500); // 2 seconds debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, searchById]);

  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ width: 300 }}>
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
      </Box>

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
