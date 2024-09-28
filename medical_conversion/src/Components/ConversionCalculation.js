// JavaScript source code
import * as React from "react";
import CircularProgress from '@mui/material/CircularProgress';
function ConversionCalculation({ medicationData, patientData, setResultsData, onCalculationComplete }) {

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (medicationData != null) {
                // Perform calculation after the delay
                setResultsData((prevData) => ({
                    ...prevData,
                    medName: medicationData.name,
                    dosage: medicationData.dosage,
                    dosageUnit: medicationData.dosageUnit,
                }));
                onCalculationComplete();
            } else {
                setResultsData((prevData) => ({
                    ...prevData,
                    error: "No Medication Data Given",
                }));
            }
        }, 3000); // 3-second delay

        // Cleanup timeout when the component is unmounted
        return () => clearTimeout(timer);
    }, [medicationData, patientData, setResultsData, onCalculationComplete]);

    return (
        <box style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <CircularProgress />
        </box>
    );
}

export default ConversionCalculation;