import React from "react";
import { Box, Typography, Paper } from '@mui/material';
import { Link } from "react-router-dom";




function Administration({ targetRoute }) {
    
    return (
        <Box component={Paper} sx={{ p: 2 }}>
            {targetRoute?.toLowerCase() === "iv" && (
                <Typography variant="body1" gutterBottom>
                    IV (intravenous) administration should be performed by a healthcare professional. The medication
                    should be delivered slowly over the prescribed period to avoid adverse reactions. Ensure proper
                    dilution of the medication in a compatible solution before administration. Monitor the patient for
                    any signs of discomfort or allergic reactions during and after the administration. Always adhere to
                    the recommended dosage guidelines, and never exceed the maximum daily limit.
                </Typography>
            )}

            {targetRoute?.toLowerCase() === "sc" && (
                <Typography variant="body1" gutterBottom>
                    SC (subcutaneous) administration involves injecting the medication under the skin. It is important
                    to rotate injection sites to prevent skin irritation. Always clean the injection site before
                    administering the medication. Ensure the syringe and needle are sterile to avoid infection. Follow
                    the prescribed dosage guidelines, and report any unusual reactions to your healthcare provider
                    immediately.
                </Typography>
            )}

            {targetRoute?.toLowerCase() === "oral" && (
                <Typography variant="body1" gutterBottom>
                    Oral administration requires taking the medication by mouth. It is recommended to take the medication
                    with a full glass of water, and in some cases, with food to prevent stomach upset. Do not crush or
                    chew extended-release tablets unless instructed by a healthcare provider. Follow the prescribed
                    dosage, and if you miss a dose, take it as soon as possible unless it’s almost time for the next dose.
                </Typography>
            )}

            {!["iv", "sc", "oral"].includes(targetRoute?.toLowerCase()) && (
                <Typography variant="body1" gutterBottom>
                    No specific administration instructions available for the selected route.
                </Typography>
            )}
        </Box>
    );

};
export default Administration;