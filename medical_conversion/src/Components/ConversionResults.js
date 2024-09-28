import { useLocation} from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Dashboard from '../Components/Dashboard';
import * as React from 'react';

function ConversionResults({medicationData,patientData,resultsData}) {
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
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Conversion Information:
                    </Typography>
                    <Typography variant="body1">
                        Medication Name: <strong>{medicationData.name}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Dosage: <strong>{medicationData.dosage} {medicationData.dosageUnit}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Form: <strong>{medicationData.route}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Target Medication: <strong>{medicationData.target}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Target Form: <strong>{medicationData.targetRoute}</strong>
                    </Typography>
                    {patientData.name != null && (
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
                        Formula Name: <strong>{medicationData.formulaName}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Formula: <strong>{medicationData.formula}</strong>
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Conversion Results: 
                    </Typography>
                    <Typography variant="body1">
                        Medication Name: <strong>{resultsData.medName}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Dosage: <strong>{resultsData.dosage} {resultsData.dosageUnit}</strong>
                    </Typography>
                </>

            ) : (
                <Typography variant="body1">No data available.</Typography>
            )}
        </Box>

    );
}

export default ConversionResults;