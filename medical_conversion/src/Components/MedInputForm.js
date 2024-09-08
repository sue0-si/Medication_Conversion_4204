import { useState, useEffect } from "react";
import { TextField, Button, Box, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography, InputAdornment, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PatientInfoForm from "./PatientInfoForm";

function MedInputForm({ redirectOnSubmit }) {
    const [medicationData, setMedicationData] = useState({
        name: '',
        dosage: '',
        dosageUnit: 'mg', // Default unit is 'mg'
        form: '',
        isAdministrative: false,  // Checkbox for administrative
        formula: ''  // Select box for different formulas
    });
    const [patientData, setPatientData] = useState({
        height: '',
        weight: '',
        gender: '',
        kidney: false,
        liver: false,
        gastro: false,
        disease: '',
    });


    const [formulas, setFormulas] = useState([]);
    const [loadingFormulas, setLoadingFormulas] = useState(true);  // Track loading state for formulas
    const [error, setError] = useState(null);  // Track error state

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch formulas from the API (when implemented)
        const fetchFormulas = async () => {
            try {
                const response = await axios.get('/api/formulas');  // Replace with actual API endpoint
                setFormulas(response.data);  // Assuming API returns an array of formulas
                setLoadingFormulas(false);
            } catch (error) {
                setError('Error fetching conversion formulas');
                setLoadingFormulas(false);
            }
        };

        fetchFormulas();
    }, []);

    // Single function to handle all form changes
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMedicationData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle change for dosage unit (ToggleButtonGroup)
    const handleDosageUnitChange = (event, newUnit) => {
        if (newUnit !== null) {
            setMedicationData((prevData) => ({
                ...prevData,
                dosageUnit: newUnit,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSubmit = {
            ...medicationData,
            patientData: medicationData.isAdministrative ? patientData : null,  // Include patient data if administrative
        };

        navigate(`/po-iv/` + redirectOnSubmit, { state: { medicationData: dataToSubmit } });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Medication Name"
                name="name"
                value={medicationData.name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <TextField
                    label="Dosage"
                    name="dosage"
                    value={medicationData.dosage}
                    onChange={handleChange}
                    required
                    type="number"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ToggleButtonGroup
                                    value={medicationData.dosageUnit}
                                    exclusive
                                    onChange={handleDosageUnitChange}
                                    aria-label="dosage unit"
                                >
                                    <ToggleButton value="mg" aria-label="milligrams">
                                        mg
                                    </ToggleButton>
                                    <ToggleButton value="ml" aria-label="milliliters">
                                        mL
                                    </ToggleButton>
                                    <ToggleButton value="g" aria-label="grams">
                                        g
                                    </ToggleButton>
                                    <ToggleButton value="units" aria-label="units">
                                        units
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    margin="normal"
                />
            </Box>
            <FormControl fullWidth margin="normal">
                <Typography variant="h6" gutterBottom>
                    Administration Method
                </Typography>
                <ToggleButtonGroup
                    value={medicationData.form}
                    exclusive
                    onChange={(event, newMethod) => {
                        setMedicationData((prevData) => ({
                            ...prevData,
                            form: newMethod,
                        }));
                    }}
                    aria-label="administration method"
                >
                    <ToggleButton value="oral" aria-label="oral">
                        Oral
                    </ToggleButton>
                    <ToggleButton value="iv-push" aria-label="iv push">
                        IV Push
                    </ToggleButton>
                    <ToggleButton value="iv-infusion" aria-label="iv infusion">
                        IV Infusion
                    </ToggleButton>
                    <ToggleButton value="iv-bolus" aria-label="iv bolus">
                        IV Bolus
                    </ToggleButton>
                </ToggleButtonGroup>
            </FormControl>

            {/* Checkbox for Administrative */}
            <FormControlLabel
                control={
                    <Checkbox
                        name="isAdministrative"
                        checked={medicationData.isAdministrative}
                        onChange={handleChange}
                    />
                }
                label="Is this medication administrative?"
            />
            {/* Show the PatientInfoForm if administrative is checked */}
            {medicationData.isAdministrative && (
                <PatientInfoForm patientData={patientData} setPatientData={setPatientData} />
            )}
            {/* Select Box for Formulas (with Loading State) */}
            {!error && (
                <FormControl fullWidth margin="normal" disabled={loadingFormulas}>
                    <InputLabel>Choose a Formula</InputLabel>
                    {loadingFormulas ? (
                        <CircularProgress />
                    ) : (
                        <Select
                            name="formula"
                            value={medicationData.formula}
                            onChange={handleChange}
                        >
                            {formulas.map((formula, index) => (
                                <MenuItem key={index} value={formula}>
                                    {formula}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                </FormControl>
            ) }

            {/* Display error message below the FormControl */}
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    );
}

export default MedInputForm;
