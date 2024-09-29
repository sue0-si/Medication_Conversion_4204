import React from "react";
import { Box, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const sampleData = [
    {usage: "Dysmenorrhea", directions: "200 to 400 mg orally every 4 hours as needed", comments: "Treatment should begin at the earliest onset of pain"}, 
    {usage: "Osteoarthritis", directions: "Initial dose: 200 mg orally every 4 to 6 hours; may increase to 400 mg orally every 4 to 6 hours as needed", comments: "In chronic conditions, a therapeutic response may be seen in a few days to a week but most often is observed by 2 weeks; after a satisfactory response has been achieved, review and adjust dose to achieve the lowest dose that yields acceptable control."}, 
    {usage: "Rheumatoid Arthritis", directions: "Initial dose: 200 mg orally every 4 to 6 hours; may increase to 400 mg orally every 4 to 6 hours as needed", comments: "In chronic conditions, a therapeutic response may be seen in a few days to a week but most often is observed by 2 weeks; after a satisfactory response has been achieved, review and adjust dose to achieve the lowest dose that yields acceptable control."}, 
    {usage: "Pain", directions: "400 to 800 mg IV every 6 hours as needed", comments: "Patients should be well hydrated prior to IV infusion to reduce the risk of renal adverse events; doses should be infused over at least 30 minutes."},
    {usage: "Fever", directions: "400 mg IV once, then 100 to 400 mg every 4 to 6 hours IV as needed", comments: "Patients should be well hydrated to reduce the risk of renal adverse events. IV doses should be infused over at least 30 minutes."}
]

const usageList = sampleData.map((item) => item.usage);


function Administration(props) {
    
    return(

        <Box sx={{ mt: 4 }}>
            {/* <p>{sampleData[1].directions}</p> */}
            {props ? (
                <div>
                    <Typography variant="body1">
                        <strong>Caution:</strong> Underdosing / Overdosing could lead to death or severe/permanent disability
                    </Typography>

                    <Typography variant="body1">
                        
                        Usual Adult Dose for: {usageList.join(', ')}
                    </Typography>


                    {/* {sampleData.map((name, index) => (
                        <Link href="#" key={index}>{name.IV}</Link>
                    ))} */}
                    
                        {sampleData.map((name, index) => (
                            //    <Typography variant="heading" key={index}>
                            //         Usual Adult Dosage for {name}
                            //    </Typography> 
                            // <p key={index}>
                            //     Usual Adult Dosage for {name.directions}
                            // </p>
                            <Box sx={{ mt: 4 }} key={index}>
                                <Typography variant="h5">Usual Adult Dosage for {name.usage}</Typography>
                                <Typography variant="body1">{name.directions}</Typography>
                                <Typography variant="body1">{name.comments}</Typography>
                            </Box>
                            
                        ))}
                </div>
            ) : (null)
            }
        </Box>
    );

};
export default Administration;