import React, { useState, useContext } from 'react';
import Dashboard from '../Components/Dashboard';
import { MedicationContext, MedicationProvider } from '../Tools/MedicationContext';
import AltConversionResults from './AltConversionResults';
import MedInputForm from '../Components/MedInputForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

const AltConversionTool = () => {
    const [isResultsView, setIsResultsView] = useState(false);
    //const { setMedicationData } = useContext(MedicationContext);

    // Handle form submission, setting data and switching to results view
    const handleFormSubmit = () => {
        setIsResultsView(true);
    };

    // Handle back button to return to the form view
    const handleBackButton = () => {
        setIsResultsView(false);
    };

    return (
            <MedicationProvider>
                {!isResultsView && (
                    <MedInputForm formtype={"alt"} onSubmit={handleFormSubmit} />
                )}

                {isResultsView && (
                    <div>
                        <IconButton onClick={handleBackButton}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <AltConversionResults />
                    </div>
                    )}
            </MedicationProvider>
    );
};

export default AltConversionTool;