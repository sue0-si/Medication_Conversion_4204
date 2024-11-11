// JavaScript source code
import React, { useState } from 'react';
import { MedicationProvider } from '../Tools/MedicationContext';
import PoIvConversionResults from './PoIvConversionResults';
import MedInputForm from '../Components/MedInputForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

const PoIvConversionTool = () => {
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
                <MedInputForm formtype={"po-iv"} onSubmit={handleFormSubmit} />
            )}

            {isResultsView && (
                <div>
                    <IconButton onClick={handleBackButton}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </IconButton>
                    <PoIvConversionResults />
                </div>
            )}
        </MedicationProvider>
    );
};

export default PoIvConversionTool;