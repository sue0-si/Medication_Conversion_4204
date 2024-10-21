import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, Box, Typography } from '@mui/material';

function AddFormulaModal({ open, handleClose, addFormula, medicationData }) {
    const [formulaName, setFormulaName] = useState('');
    const [sourceDrug, setSourceDrug] = useState('');
    const [targetDrug, setTargetDrug] = useState('');
    const [conversionRatio, setConversionRatio] = useState('');
    const [customFormula, setCustomFormula] = useState('');
    const [useCustomFormula, setUseCustomFormula] = useState(false);
    const [drugClass, setDrugClass] = useState('');  // New field for class

    // Auto-fill form based on medicationData
    useEffect(() => {
        if (medicationData) {
            setSourceDrug(medicationData.name || '');
            setFormulaName(medicationData.formula || '');
            setTargetDrug(medicationData.target || '');
            // Additional autofill logic can be added here if more fields in medicationData need to be reflected
        }
    }, [medicationData]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const newFormula = {
            formulaName,
            sourceDrug,
            targetDrug,
            conversionRatio: useCustomFormula ? null : parseFloat(conversionRatio),
            customFormula: useCustomFormula ? customFormula : null,
            formulaType: useCustomFormula ? 'custom' : 'ratio',
            class: drugClass  // Save the class
        };

        addFormula(newFormula);  // Call parent's function to add formula
        handleClose();  // Close the modal
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
                <Typography variant="h6">Add a Custom Formula</Typography>

                <Typography variant="body1" gutterBottom>
                    Enter a conversion ratio (e.g., 1:4.5) for standard conversion, or define a custom mathematical formula using variables (e.g., "dose * 0.5 + 10").
                </Typography>

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
                        placeholder="e.g., opioid, benzodiazepine, etc."
                    />
                    <TextField
                        label="Source Drug"
                        value={sourceDrug}
                        onChange={(e) => setSourceDrug(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        placeholder="e.g., Morphine, Diazepam"
                    />
                    <TextField
                        label="Target Drug"
                        value={targetDrug}
                        onChange={(e) => setTargetDrug(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        placeholder="e.g., Hydromorphone, Lorazepam"
                    />

                    <Button onClick={() => setUseCustomFormula(!useCustomFormula)} sx={{ mb: 2 }}>
                        {useCustomFormula ? "Switch to Ratio" : "Use Custom Formula"}
                    </Button>

                    {!useCustomFormula ? (
                        <TextField
                            label="Conversion Ratio"
                            value={conversionRatio}
                            onChange={(e) => setConversionRatio(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            placeholder="Enter ratio (e.g., 1:4.5)"
                        />
                    ) : (
                        <TextField
                            label="Custom Formula"
                            value={customFormula}
                            onChange={(e) => setCustomFormula(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            placeholder="e.g., dose * 0.5 + 5"
                        />
                    )}

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add Formula
                    </Button>
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
    p: 4
};

export default AddFormulaModal;