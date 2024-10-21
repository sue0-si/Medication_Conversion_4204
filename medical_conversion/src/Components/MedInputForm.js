import { useState, useEffect } from "react";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, ToggleButton, ToggleButtonGroup, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { useNavigate } from 'react-router-dom';
import PatientInfoForm from "./PatientInfoForm";
import SelectFormula from "./SelectFormula";
import { extractFormulaOptions } from "../Tools/formulaOptions";

function MedInputForm({ redirectOnSubmit, medicationData, setMedicationData, patientData, setPatientData, formtype }) {
    const [submittedData, setSubmittedData] = useState(null);  // Store the form data on submit
    const navigate = useNavigate();
    const [showPatientForm, setShowPatientForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [openErrorDialog, setOpenErrorDialog] = useState(false);  // For controlling pop-up dialog
    const [altMedOptions, setAltMedOptions] = useState(["Please input medication name to see alternative options"]); // var for alternative medications with default
    const [formulaOptions, setFormulaOptions] = useState([]);

    // Load formula options on component mount
    useEffect(() => {
        const allOptions = extractFormulaOptions();
        setFormulaOptions(allOptions);   // Set only the formula names for the combo box
        console.log("Fetched Formula Options:", allOptions);
    }, []);

    const getFilteredOptions = () => {
        const filtered = formulaOptions.filter(option => {
            const isRelevantMedication = option.formulaName.toLowerCase().includes(medicationData.name?.toLowerCase());
            const isRelevantRoute = !medicationData.route || option.formulaName.toLowerCase().includes(medicationData.route?.toLowerCase());
            return isRelevantMedication && isRelevantRoute;  // Optionally add other filters
        });

        // Log the filtered options
        console.log("Filtered Formula Options:", filtered);
        return filtered;
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMedicationData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    //handle Change that updates altMedOptions for the AltConversion 
    const handleMedicationNameChange = (event) => {
        const value = event.target.value;
        setMedicationData((prevData) => ({
            ...prevData,
            name: value, // Update medicationData.name
        }));

        // Call function to dynamically update Autocomplete options
        setAltOptions();
    };

    const handleClick = () => {
        setShowPatientForm(!showPatientForm)
        if (showPatientForm) {
            setMedicationData((prevData) => ({
                ...prevData,
                patient: true
            }));
        } else {
            setMedicationData((prevData) => ({
                ...prevData,
                patient: false
            }));
        }
        
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate required fields
        const validationErrors = {};
        if (!medicationData.name) validationErrors.name = "Medication name is required.";
        if (!medicationData.dosage) validationErrors.dosage = "Dosage is required.";
        if (!medicationData.dosageUnit) validationErrors.dosageUnit = "Dosage unit is required.";
        if (!medicationData.route) validationErrors.route = "Administration route is required.";
        if (!medicationData.target) validationErrors.target = "Target medication is required.";
        if (!medicationData.targetRoute && formtype === 'po-iv') validationErrors.targetRoute = "Target administration method is required.";

        // Set errors if there are any
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setOpenErrorDialog(true);  // Open error dialog if there are validation errors
            return;
        }

        setSubmittedData(medicationData);
        navigate(redirectOnSubmit + medicationData.name, { state: { medicationData, patientData } });
    };

    const handleCloseDialog = () => {
        setOpenErrorDialog(false);  // Close the error dialog
    };

    //set alt med options for alt med conversion
    const setAltOptions = () => {
        if (medicationData.name != null) {
            //insert api call here

            //default, if no alts found
            setAltMedOptions(["No alternative medication options found."]);
        }
    }

    return (
        <FormControl component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

            {/*PO-IV form*/}
            {formtype === 'po-iv' && (
                <>
                    <TextField
                        label="Medication Name"
                        name="name"
                        value={medicationData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />

                </>
            )}
            

            {/*ALT form*/}
            {formtype === 'alt' && (
                <>
                    <TextField
                        label="Medication Name"
                        name="name"
                        value={medicationData.name}
                        onChange={handleMedicationNameChange}
                        required
                        fullWidth
                        margin="normal"
                    />

                    
                    <Autocomplete
                        label="Desired Medication Name"
                        freeSolo
                        required
                        autoSelect
                        options={altMedOptions}
                        value={medicationData.target}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option.title;
                        }}
                        onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                                setMedicationData((prevData) => ({
                                    ...prevData,
                                    target: newValue,
                                }));
                            } else if (newValue && newValue.inputValue) {
                                // Create a new value from the user input
                                setMedicationData((prevData) => ({
                                    ...prevData,
                                    target: newValue.inputValue,
                                }));
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Desired Medication Name" variant="outlined" />
                        )}
                    />
                    
                </>
            )}

            <FormControl fullWidth margin="normal">
                <Typography variant="h6" gutterBottom>
                    Administration Method
                </Typography>
                <ToggleButtonGroup
                    value={medicationData.route}
                    exclusive
                    required
                    onChange={(event, newMethod) => {
                        setMedicationData((prevData) => ({
                            ...prevData,
                            route: newMethod,
                        }));
                    }}
                    aria-label="administration method"
                >
                    <ToggleButton value="oral" aria-label="oral">Oral</ToggleButton>
                    <ToggleButton value="iv" aria-label="iv">IV</ToggleButton>
                    <ToggleButton value="sc" aria-label="sc">SC</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>

            {/*PO-IV form*/}
            {formtype === 'po-iv' && (
                <>
                    <TextField
                        label="Desired Medication"
                        name="target"
                        value={medicationData.target}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <Typography variant="h6" gutterBottom>
                            Desired Administration Method
                        </Typography>
                        <ToggleButtonGroup
                            value={medicationData.targetRoute}
                            exclusive
                            required
                            onChange={(event, newMethod) => {
                                setMedicationData((prevData) => ({
                                    ...prevData,
                                    targetRoute: newMethod,
                                }));
                            }}
                            aria-label="target administration method"
                        >
                            <ToggleButton value="oral" aria-label="oral">Oral</ToggleButton>
                            <ToggleButton value="iv" aria-label="iv push">IV</ToggleButton>
                            <ToggleButton value="sc" aria-label="sc">SC</ToggleButton>
                        </ToggleButtonGroup>
                    </FormControl>
                </>
            )}

            

            {/* Dosage Input Field */}
            <TextField
                label="Dosage"
                name="dosage"
                value={medicationData.dosage}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                type="number"
            />

            {/* Dosage Unit Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Dosage Unit</InputLabel>
                <Select
                    name="dosageUnit"
                    value={medicationData.dosageUnit}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="mg">mg</MenuItem>
                    <MenuItem value="mL">mL</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="units">units</MenuItem>
                </Select>
            </FormControl>

            {/*Formulae selection*/}

            <SelectFormula
                label="Conversion Formula"
                options={getFilteredOptions()}  // Provide dynamically loaded formula options
                medicationData={medicationData}
                setMedicationData={setMedicationData}
            />

            {/*add patient section*/}
            <FormControl fullWidth margin="normal">
                <Box>
                    <button type="button" onClick={handleClick}>
                        {showPatientForm ? "Remove Patient" : "Add Patient"}
                    </button>

                    {/* Conditionally render the PatientInfo form */}
                    {showPatientForm && (<PatientInfoForm patientData={patientData} setPatientData={setPatientData} />)}
                </Box>
            </FormControl>
            {/*submit button*/}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Submit
            </Button>

            {/* Error Dialog */}
            <Dialog
                open={openErrorDialog}
                onClose={handleCloseDialog}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">Submission Errors</DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        Please fix the following errors before submitting:
                        <ul>
                            {Object.values(errors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </FormControl>
    );
}

export default MedInputForm;
