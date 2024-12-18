import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from "@mui/material";

const ReusableForm = ({
  title = "Form title",
  fields,
  onSubmit,
  submitButtonLabel = "Submit",
  watch,
  control,
  errors,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      {title && (
        <Typography variant="h5" align="center" gutterBottom>
          {title}
        </Typography>
      )}

      {fields.map((field) => (
        <Box key={field.name} mb={2}>
          {field.type === "select" ? (
            <FormControl fullWidth error={!!errors[field.name]}>
              <InputLabel>{field.label}</InputLabel>
              <Controller
                name={field.name}
                control={control}
                rules={field.rules}
                defaultValue={field.defaultValue || ""}
                render={({ field: controllerField }) => (
                  <Select {...controllerField}>
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors[field.name] && (
                <Typography color="error" variant="body2">
                  {errors[field.name]?.message}
                </Typography>
              )}
            </FormControl>
          ) : (
            <Controller
              name={field.name}
              control={control}
              rules={field.rules}
              defaultValue={field.defaultValue || ""}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label={field.label}
                  type={field.type}
                  fullWidth
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                />
              )}
            />
          )}
        </Box>
      ))}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {submitButtonLabel}
      </Button>
    </Box>
  );
};

export default ReusableForm;
