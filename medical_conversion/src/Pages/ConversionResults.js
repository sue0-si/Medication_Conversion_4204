import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Dashboard from '../Components/Dashboard';

function ConversionResults() {
    const location = useLocation();
    const { medicationData } = location.state || {}; // Access the passed form data

    const [patientData, setPatientData] = useState(null);

    useEffect(() => {
        // Load patient data from local storage when component mounts
        const storedData = localStorage.getItem("patientData");
        if (storedData) {
            setPatientData(JSON.parse(storedData));
        }
    }, []);
    return (
        <Dashboard heading="Conversion Results">
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
                        {medicationData.isAdministrative && medicationData.patientData && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Patient Information:
                                </Typography>
                                <Typography variant="body1">Height: {medicationData.patientData.height} cm</Typography>
                                <Typography variant="body1">Weight: {medicationData.patientData.weight} kg</Typography>
                                <Typography variant="body1">Gender: {medicationData.patientData.gender}</Typography>
                                <Typography variant="body1">Kidney Impairment: {medicationData.patientData.kidney ? 'Yes' : 'No'}</Typography>
                                <Typography variant="body1">Liver Impairment: {medicationData.patientData.liver ? 'Yes' : 'No'}</Typography>
                                <Typography variant="body1">Gastro Impairment: {medicationData.patientData.Gastro ? 'Yes' : 'No'}</Typography>

                                <Typography variant="body1">Disease: {medicationData.patientData.disease}</Typography>
                            </>
                        )}
                    </>
                ) : (
                    <Typography variant="body1">No data available.</Typography>
                )}
            </Box>
        </Dashboard>
    );
}

export default ConversionResults;