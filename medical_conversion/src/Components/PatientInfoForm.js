// src/components/PatientInfoForm.jsx

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import * as React from "react";

function PatientInfoForm({ patientData, setPatientData }) {
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newData = {
      ...patientData,
      [name]: type === "checkbox" ? checked : value,
    };
    setPatientData(newData);
  };

  return (
    <div>
      <TextField
        label="Height (cm)"
        name="height"
        value={patientData.height || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        label="Weight (kg)"
        name="weight"
        value={patientData.weight || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Gender</InputLabel>
        <Select name="gender" value={patientData.gender || ""} onChange={handleChange}>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      {patientData.gender === "female" && (
        <FormControlLabel
          control={
            <Checkbox
              name="pregnant"
              checked={!!patientData.pregnant}
              onChange={handleChange}
            />
          }
          label="Pregnant"
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            name="liver"
            checked={!!patientData.liver}
            onChange={handleChange}
          />
        }
        label="Liver Impairment"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="kidney"
            checked={!!patientData.kidney}
            onChange={handleChange}
          />
        }
        label="Kidney Impairment"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="gastro"
            checked={!!patientData.gastro}
            onChange={handleChange}
          />
        }
        label="GI Impairment"
      />
      <TextField
        label="Existing Disease"
        name="disease"
        value={patientData.disease || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </div>
  );
}

export default PatientInfoForm;
