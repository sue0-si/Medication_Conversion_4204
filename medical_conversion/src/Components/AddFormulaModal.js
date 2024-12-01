import React, { useState, useEffect, useRef } from 'react';
import { Modal, TextField, Button, Box, Typography, Tooltip } from '@mui/material'; // Added Tooltip

function AddFormulaModal({ open, handleClose, addFormula, medicationData }) {
    const [formulaName, setFormulaName] = useState('');
    const [sourceDrug, setSourceDrug] = useState('');
    const [targetDrug, setTargetDrug] = useState('');
    const [customFormula, setCustomFormula] = useState('dose');
    const [drugClass, setDrugClass] = useState('');
    const [formulaError, setFormulaError] = useState(''); 
    
    const inputRef = useRef(null); // **Ref to manage cursor position**

    // Auto-fill form based on medicationData
    useEffect(() => {
        if (medicationData) {
            setSourceDrug(medicationData.name || '');
            setTargetDrug(medicationData.target || '');
            setFormulaName(medicationData.formulaName || `${medicationData.name} to ${medicationData.target}`);
        }
    }, [medicationData]);

    // **Handler to Restrict Input Characters and Ensure "dose" Remains**
    const handleCustomFormulaChange = (e) => {
        const value = e.target.value;

        // Allowed characters: numbers, parentheses, brackets, ^, *, -, +, /, and "dose" (case-insensitive)
        const regex = /^[0-9()\[\]\^\*\-\+\/\s]*dose[0-9()\[\]\^\*\-\+\/\s]*$/i;

        if (regex.test(value)) {
            setCustomFormula(value); // Update state with valid input

            // Validate the formula
            const isValid = validFormula(value);
            if (isValid) {
                setFormulaError(''); // Clear any existing errors
            } else {
                setFormulaError('Invalid formula');
            }
        } 
    };

    // Function to Validate the Formula
    const validFormula = (formula) => {
        try {
            // Replace all instances of "dose" (case-insensitive) with 1
            const formulaToValidate = formula.replace(/dose/gi, '1');

            // Use the Function constructor to evaluate the formula safely
            const func = new Function(`return (${formulaToValidate});`);
            const result = func(); // Attempt to execute the formula

            // Check if the result is a finite number
            if (typeof result === 'number' && isFinite(result)) {
                return true; // Valid formula
            } else {
                return false; // Invalid formula (e.g., division by zero resulting in Infinity)
            }
        } catch (error) {
            return false; 
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const newFormula = {
            formulaName,
            sourceDrug,
            targetDrug,
            customFormula, 
            justification: "User Custom",
            class: drugClass,
        };

        addFormula(newFormula); // Add the new formula
        handleClose(); // Close the modal

        // **Reset the form and errors after successful submission**
        setFormulaError('');
        setCustomFormula('dose'); // **Reset to "dose"**
    };

    // Determine if the form is valid
    const isValid = !formulaError && customFormula.trim() !== '';

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
                <Typography variant="h6">Add a Custom Formula</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Formula Name"
                        value={formulaName}
                        onChange={(e) => setFormulaName(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Drug Class"
                        value={drugClass}
                        onChange={(e) => setDrugClass(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        placeholder="e.g., opioid, benzodiazepine"
                    />
                    <TextField
                        label="Source Drug"
                        value={sourceDrug}
                        onChange={(e) => setSourceDrug(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        placeholder="e.g., Morphine"
                    />
                    <TextField
                        label="Target Drug"
                        value={targetDrug}
                        onChange={(e) => setTargetDrug(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        placeholder="e.g., Hydromorphone"
                    />

                    <TextField
                        label="Custom Formula"
                        value={customFormula}
                        onChange={handleCustomFormulaChange} // Use the updated handler
                        required
                        fullWidth
                        margin="normal"
                        helperText={formulaError || "Example: (dose * 0.5) + 5"}
                        error={!!formulaError}
                        inputRef={inputRef}
                    />

                    {/* Wrap the Button with Tooltip */}
                    <Tooltip title={!isValid ? "Invalid formula" : ""} disableHoverListener={isValid}>
                        {/* Use a span to wrap the Button because Tooltip doesn't work with disabled buttons */}
                        <span>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                disabled={!isValid} // Disable button when not valid
                            >
                                Add Formula
                            </Button>
                        </span>
                    </Tooltip>
                </form>
            </Box>
        </Modal>
    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default AddFormulaModal;
