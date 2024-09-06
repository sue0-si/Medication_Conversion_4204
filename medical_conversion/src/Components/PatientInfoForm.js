import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

function PatientInfoForm({ patientData, setPatientData }) {
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setPatientData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div>
            <TextField
                label="Height (cm)"
                name="height"
                value={patientData.height}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
            <TextField
                label="Weight (kg)"
                name="weight"
                value={patientData.weight}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                    name="gender"
                    value={patientData.gender}
                    onChange={handleChange}
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        name="organDamage"
                        checked={patientData.organDamage}
                        onChange={handleChange}
                    />
                }
                label="Has Organ Damage"
            />
            <TextField
                label="Existing Disease"
                name="disease"
                value={patientData.disease}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </div>
    );
}

export default PatientInfoForm;
