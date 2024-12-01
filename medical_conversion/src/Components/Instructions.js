import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Stack } from '@mui/material';
import NavigationClosedView from '../Images/NavigationClosedView.png';
import NavigationInstructions from '../Images/NavigationInstructions.png'
import NavigationSearch from '../Images/NavigationSearch.png'
import NavigationPOIV from '../Images/NavigationPOIV.png'
import NavigationFeedback from '../Images/NavigationFeedback.png'

//Add new instructions here, make sure to import Image and store in /Images folder
const instructions = [
    {
        image: NavigationClosedView,
        description: 'Use this button to expand the navigation tabs.',
    },
    {
        image: NavigationInstructions,
        description: 'Click the collapsed or expanded links to navigate the site, or use the \'plus\' buttons to add coversion tools to the page you\'re currently on.',
    },
    {
        image: NavigationSearch,
        description: 'Use a search bar on the top left to retrieve a general information of the desired drug.'
    },
    {
        image: NavigationPOIV,
        description: 'For PO-IV and alt-medication conversion, choose the source and destination medication and input the amount of dosage. By clicking submit button, the conversion result will be shown.'
    }, 
    {
        image: NavigationFeedback,
        description: 'Choose either feedback or bug report and write a message.'
    }
];

const Instructions = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < instructions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Navigation and Features
            </Typography>

            <Card sx={{ maxWidth: 700, margin: '0 auto', boxShadow: 3 }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={instructions[currentStep].image}
                    alt={`Step ${currentStep + 1}`}
                    sx={{ objectFit: 'contain' }}
                />

                {/*<img sx={{ objectFit: 'contain' }} height="300" alt={`Step ${currentStep + 1}`} src={instructions[currentStep].image}/>*/}

                <CardContent>
                    <Typography variant="body1">
                        {instructions[currentStep].description}
                    </Typography>
                </CardContent>
            </Card>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={currentStep === instructions.length - 1}
                >
                    Next
                </Button>
            </Stack>

            <Typography variant="caption" sx={{ marginTop: 2, display: 'block' }}>
                Step {currentStep + 1} of {instructions.length}
            </Typography>
        </Box>
    );
};

export default Instructions;