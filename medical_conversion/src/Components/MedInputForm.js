import { useState, useEffect } from "react";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MedInputForm({ redirectOnSubmit }) {
    const [medicationData, setMedicationData] = useState({
        name: '',
        // dosage: '',  // Commenting out dosage-related functionality
        // dosageUnit: 'mg', // Default unit is 'mg', commented out
        route: '',  // Renamed from form to route for administrative method
        // isAdministrative: false,  // Checkbox for administrative, commented out
        formula: ''  // Select box for different formulas
    });

    const [formulas, setFormulas] = useState([]);
    const [loadingFormulas, setLoadingFormulas] = useState(true);
    const [error, setError] = useState(null);
    // const [dosages, setDosages] = useState([]); // State for storing API response data, commented out
    // const [loadingDosages, setLoadingDosages] = useState(false); // Track loading state for dosages, commented out

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch formulas from the API (if needed)
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

    // Fetch dosages from DrugBank API based on medication name and route
    // Commenting out fetchDosages function as dosage functionality is not required
    /*
    const fetchDosages = async () => {
        setLoadingDosages(true);
        try {
            // Replace with actual DrugBank API endpoint and include authentication headers if necessary
            const response = await axios.get(`https://api.drugbank.com/v1/us/product_concepts/search`, {
                params: {
                    name: medicationData.name,
                    route: medicationData.route
                }
            });
            setDosages(response.data);
            setLoadingDosages(false);
        } catch (error) {
            setError('Error fetching dosages');
            setLoadingDosages(false);
        }
    };
    */

    // Single function to handle all form changes
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMedicationData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        // await fetchDosages(); // Fetch dosages before redirecting, commented out
        // Navigate to the ConversionResults page, passing form data via state
        navigate(`/po-iv/` + redirectOnSubmit, { state: { medicationData } });
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

            {/* Setting route using administrative method */}
            <FormControl fullWidth margin="normal">
                <Typography variant="h6" gutterBottom>
                    Administration Method
                </Typography>
                <ToggleButtonGroup
                    value={medicationData.route}
                    exclusive
                    onChange={(event, newMethod) => {
                        setMedicationData((prevData) => ({
                            ...prevData,
                            route: newMethod,  // Using route instead of form
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

            {/* Checkbox for Administrative - Commented out */}
            {/* <FormControlLabel
                control={
                    <Checkbox
                        name="isAdministrative"
                        checked={medicationData.isAdministrative}
                        onChange={handleChange}
                    />
                }
                label="Is this medication administrative?"
            /> */}

            {/* Select Box for Formulas (with Loading State) */}
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

            {/* Display error message below the FormControl */}
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
            </Button>

            {/* Display dosage options from API, commented out */}
            {/* {dosages.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Available Dosages:</Typography>
                    <ul>
                        {dosages.map((dosage, index) => (
                            <li key={index}>{dosage.name} - {dosage.strengths}</li>
                        ))}
                    </ul>
                </Box>
            )} */}
        </Box>
    );
}

export default MedInputForm;
