import React, { useContext, useState, useEffect } from 'react';
import { MedicationContext } from '../Tools/MedicationContext';
import { extractMedicationOptions } from '../Tools/Options';  // Correct file reference for options
import { Autocomplete, TextField } from '@mui/material';

// Helper function to ensure safe string operations
const getSafeLowerCase = (value) => {
    return typeof value === 'string' ? value.toLowerCase() : '';
};

const SelectMedication = ({ label, field }) => {
    const { medicationData, setMedicationData } = useContext(MedicationContext);
    const [medicationConversions, setMedicationConversions] = useState({ to: {}, from: {} });
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [inputValue, setInputValue] = useState(medicationData[field] || '');  // Initialize with the selected value

    // Load all available medications and conversions when the component mounts
    useEffect(() => {
        const allOptions = extractMedicationOptions();  // Get all medication options and conversions
        setMedicationConversions(allOptions);
    }, []);

    // Filter options dynamically based on the selected field (name or target) and other field's value
    useEffect(() => {
        let relevantOptions = [];
        

        // If selecting source medication
        if (field === "name") {
            if (medicationData.target !=="") {
                // If target is selected, show all source meds that can convert to the target
                relevantOptions = medicationConversions.from[medicationData.target] || [];
            } else {
                // If no target is selected, show all possible source medications
                relevantOptions = Object.keys(medicationConversions.to);  // All source medications
            }
        }

        // If selecting target medication (field === 'target')
        else if (field === "target") {
            if (medicationData.name !== "") {
                // If source is selected, show all target meds that can be converted from the source
                relevantOptions = medicationConversions.to[medicationData.name] || [];
            } else {
                // If no source is selected, show all possible target medications
                relevantOptions = Object.keys(medicationConversions.from);  // All target medications
            }
        }

        // Map the relevant options into objects with a `label` property for display in Autocomplete
        const filtered = relevantOptions.map(option => ({
            label: option
        }));
        setFilteredOptions(filtered);
    }, [field, medicationData.name, medicationData.target, medicationConversions]);

    // Handle selection change for the current field (name or target)
    const handleSelectChange = (event, newValue) => {
        // Check if the newValue is null (meaning the user cleared the selection)
        const selectedValue = newValue ? (newValue.label || newValue) : "";
        // Update the medicationData state
        setMedicationData(prevData => ({
            ...prevData,
            [field]: selectedValue
        }));

        // Set the inputValue to the selected value or clear it if null
        setInputValue(selectedValue || '');
    };

    const handleInputChange = (event, newInputValue) => {
        if (newInputValue !== "") {
            setInputValue(newInputValue);  // Update input field as the user types
        }
    };

    return (
        <div>
            <Autocomplete
                freeSolo
                options={filteredOptions}  // Filtered options based on the logic above
                value={medicationData[field] || ''}  // Dynamically set the value for the given field (name/target)
                onChange={handleSelectChange}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                noOptionsText="No options found"
                getOptionLabel={(option) => option.label || ''}  // Display the label (the medication name)
                renderInput={(params) => (
                    <TextField {...params} label={label} variant="outlined" fullWidth />
                )}
            />
        </div>
    );
};

export default SelectMedication;
