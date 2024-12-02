// SelectFormula.js

import React, { useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import AddFormulaModal from './AddFormulaModal';

function SelectFormula({ formtype, label, medicationData, setMedicationData, options, addNewFormula }) {
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);  // Control modal visibility

    // Handle formula selection change
    const handleFormulaChange = (event, newValue) => {
        const selectedFormula = options.find(formula => formula.formulaName === newValue);
        if (selectedFormula) {
            setMedicationData(prevData => ({
                ...prevData,
                formulaName: selectedFormula.formulaName,
                formula: selectedFormula,
                formulaJustification: selectedFormula.justification || `Default Formula from ${selectedFormula.sourceDrug}`
            }));
        }
    };

    // Function to add a new formula from the modal
    const handleAddNewFormula = (newFormula) => {
        addNewFormula(newFormula); // Let MedInputForm handle updating formulaOptions
    };

    return (
        <div>
            <Autocomplete
                freeSolo
                options={options.map(formula => formula.formulaName)}  // Display filtered formula names
                value={medicationData.formulaName || ''}  // Set the selected formula name
                inputValue={inputValue}
                onChange={handleFormulaChange}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                noOptionsText="No formulae found based on form entries"
                renderInput={(params) => (
                    <TextField {...params} label={label} variant="outlined" fullWidth />
                )}
            />

            <Button variant="outlined" onClick={() => setIsModalOpen(true)} sx={{ mt: 2 }}>
                Add New Formula
            </Button>

            {/* Modal for Adding Formula */}
            <AddFormulaModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}  // Close modal
                addFormula={handleAddNewFormula}  // Add the new formula
                medicationData={medicationData}  // Pass medication data to autofill the modal
            />
        </div>
    );
}

export default SelectFormula;
