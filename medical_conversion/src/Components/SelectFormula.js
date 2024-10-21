import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import AddFormulaModal from './AddFormulaModal';

function SelectFormula({ label, options, medicationData, setMedicationData }) {
    const [inputValue, setInputValue] = useState('');
    const [customFormulae, setCustomFormulae] = useState([...options]);  // Initialize with provided options
    const [isModalOpen, setIsModalOpen] = useState(false);  // Control modal visibility

    useEffect(() => {
        setCustomFormulae([...options]);  // Update customFormulae whenever new options are passed in
        console.log("Options passed to autocomplete: ", customFormulae);
    }, [options]);  // Ensure this runs when options changes
    // Function to add a new formula from the modal
    const addNewFormula = (newFormula) => {
        setCustomFormulae([...customFormulae, newFormula]);  // Add the full formula object to the list
        setMedicationData((prevData) => ({
            ...prevData,
            formulaName: newFormula.formulaName,  // Set the newly added formula name
            formula: newFormula  // Set the full formula details
        }));
    };

    // Handle selection change in the Autocomplete dropdown
    const handleFormulaChange = (event, newValue) => {
        const selectedFormula = customFormulae.find(formula => formula.formulaName === newValue);
        if (selectedFormula) {
            setMedicationData((prevData) => ({
                ...prevData,
                formulaName: selectedFormula.formulaName,  // Set the selected formula name
                formula: selectedFormula  // Set the full formula details (conversion ratios, etc.)
            }));
        }
    };
    

    return (
        <div>
            {/* Autocomplete with custom formula options */}
            <Autocomplete
                freeSolo
                autoSelect
                options={customFormulae.map(formula => formula.formulaName)}  // Display formula names in the dropdown
                value={medicationData.formulaName || ''}  // Set the selected formula name
                inputValue={inputValue}
                getOptionLabel={(option) => option}  // Use formula names as options
                onChange={handleFormulaChange}  // Set both formulaName and formula in medicationData
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);  // Handle free input typing
                }}
                renderInput={(params) => (
                    <TextField {...params} label={label || "Conversion Formula"} variant="outlined" fullWidth />
                )}
            />

            {/* Button to open AddFormulaModal for adding new formula */}
            <Button variant="outlined" onClick={() => setIsModalOpen(true)} sx={{ mt: 2 }}>
                Add New Formula
            </Button>

            {/* Modal for Adding Formula */}
            <AddFormulaModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}  // Close modal on submission or cancel
                addFormula={addNewFormula}  // Add the new formula to the options list
                medicationData={medicationData}  // Pass medication data to autofill the modal
            />
        </div>
    );
}

export default SelectFormula;