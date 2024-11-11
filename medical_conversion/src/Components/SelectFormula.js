import React, { useState, useEffect, useContext } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import AddFormulaModal from './AddFormulaModal';
import { extractFormulaOptions } from '../Tools/Options';
import { MedicationContext } from '../Tools/MedicationContext';

function SelectFormula() {
    const { medicationData, setMedicationData } = useContext(MedicationContext);
    const [inputValue, setInputValue] = useState('');
    const [formulaOptions, setFormulaOptions] = useState([]);  // All formula options
    const [filteredOptions, setFilteredOptions] = useState([]);  // Filtered formula options
    const [isModalOpen, setIsModalOpen] = useState(false);  // Control modal visibility

    // Load all formula options on mount
    useEffect(() => {
        const allOptions = extractFormulaOptions();
        setFormulaOptions(allOptions);
    }, []);

    // Filter options based on source and target
    useEffect(() => {
        let relevantOptions = formulaOptions;

        // Filter by source medication
        if (medicationData.name !== "") {
            relevantOptions = relevantOptions.filter(option =>
                option.sourceDrug.toLowerCase() === medicationData.name.toLowerCase()
            );
        }

        // Filter by target medication
        if (medicationData.target !== "") {
            relevantOptions = relevantOptions.filter(option =>
                option.targetDrug.toLowerCase() === medicationData.target.toLowerCase()
            );
        }

        setFilteredOptions(relevantOptions);
    }, [medicationData.name, medicationData.target, formulaOptions]);

    // Handle formula selection change
    const handleFormulaChange = (event, newValue) => {
        const selectedFormula = filteredOptions.find(formula => formula.formulaName === newValue);
        if (selectedFormula) {
            setMedicationData(prevData => ({
                ...prevData,
                formulaName: selectedFormula.formulaName,
                formula: selectedFormula,
                formulaJustification: selectedFormula.justification === "" ? "Default Formula from {Source}" : selectedFormula.justification
            }));
        }
    };

    // Function to add a new formula from the modal
    const addNewFormula = (newFormula) => {
        setFormulaOptions([...formulaOptions, newFormula]);  // Add new formula to all options
        setFilteredOptions([...filteredOptions, newFormula]);  // Add new formula to filtered options
        setMedicationData(prevData => ({
            ...prevData,
            formulaName: newFormula.formulaName,
            formula: newFormula,
            formulaJustification: newFormula.justification === "" ? "User added custom formula" : newFormula.justification
        }));
    };

    return (
        <div>
            <Autocomplete
                freeSolo
                options={filteredOptions.map(formula => formula.formulaName)}  // Display filtered formula names
                value={medicationData.formulaName || ''}  // Set the selected formula name
                inputValue={inputValue}
                onChange={handleFormulaChange}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                noOptionsText="No formulae found based on form entries"
                renderInput={(params) => (
                    <TextField {...params} label="Conversion Formula" variant="outlined" fullWidth />
                )}
            />

            <Button variant="outlined" onClick={() => setIsModalOpen(true)} sx={{ mt: 2 }}>
                Add New Formula
            </Button>

            {/* Modal for Adding Formula */}
            <AddFormulaModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}  // Close modal
                addFormula={addNewFormula}  // Add the new formula
                medicationData={medicationData}  // Pass medication data to autofill the modal
            />
        </div>
    );
}

export default SelectFormula;
