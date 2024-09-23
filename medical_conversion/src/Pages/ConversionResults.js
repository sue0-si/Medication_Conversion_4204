import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Dashboard from '../Components/Dashboard';
import * as React from 'react';

function ConversionResults({medicationData,patientData}) {
    const location = useLocation();

    //const [patientData, setPatientData] = React.useState(null);

    //React.useEffect(() => {
    //    // Load patient data from local storage when component mounts
    //    const storedData = localStorage.getItem("patientData");
    //    if (storedData) {
    //        setPatientData(JSON.parse(storedData));
    //    }
    //}, []);
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Conversion Results
            </Typography>
            {medicationData ? (
                <>
                    <Typography variant="body1">
                        Medication Name: {medicationData.name}
                    </Typography>
                    <Typography variant="body1">
                        Dosage: {medicationData.dosage} {medicationData.dosageUnit}
                    </Typography>
                    <Typography variant="body1">
                        Form: {medicationData.form}
                    </Typography>
                    <Typography variant="body1">
                        Administrative: {medicationData.isAdministrative ? 'Yes' : 'No'}
                    </Typography>
                    {patientData != null && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Patient Information:
                            </Typography>
                            <Typography variant="body1">Height: {patientData.height} cm</Typography>
                            <Typography variant="body1">Weight: {patientData.weight} kg</Typography>
                            <Typography variant="body1">Gender: {patientData.gender}</Typography>
                            <Typography variant="body1">Kidney Impairment: {patientData.kidney ? 'Yes' : 'No'}</Typography>
                            <Typography variant="body1">Liver Impairment: {patientData.liver ? 'Yes' : 'No'}</Typography>
                            <Typography variant="body1">Gastro Impairment: {patientData.Gastro ? 'Yes' : 'No'}</Typography>

                            <Typography variant="body1">Disease: {patientData.disease}</Typography>
                        </>
                    )}
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Conversion Formula:
                    </Typography>
                    <Typography variant="body1">
                        <strong>Formula Name:</strong> {medicationData.formulaName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Formula:</strong> {medicationData.formula}
                    </Typography>
                </>

            ) : (
                <Typography variant="body1">No data available.</Typography>
            )}
        </Box>
    );
}

export default ConversionResults;