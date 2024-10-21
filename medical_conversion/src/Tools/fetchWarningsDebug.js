const axios = require('axios');

// Function to fetch warning data for a specific drug name
const fetchWarningsDebug = async (drugName) => {
    try {
        const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(drugName)}&limit=1`);
        const newWarnings = [];

        // Define the mapping of API fields to warning sections
        const warningFieldsMap = {
            boxed_warning: "Boxed Warning",
            warnings: "Warnings",
            precautions: "Precautions",
            contraindications: "Contraindications",
            drug_interactions: "Drug Interactions",
            pregnancy: "Pregnancy",
            geriatric_use: "Geriatric Use",
            pediatric_use: "Pediatric Use"
        };

        // Check if the response has results
        if (response.data.results && response.data.results.length > 0) {
            const warningData = response.data.results[0];

            // Iterate over each field and extract content individually
            for (const [field, sectionName] of Object.entries(warningFieldsMap)) {
                try {
                    let content = "No information available.";

                    // Check if the field exists in the warningData and has content
                    if (warningData[field] && warningData[field].length > 0) {
                        // Clean up the content by removing section headers like "DRUG INTERACTIONS:"
                        content = warningData[field][0];
                        content = content.replace(/^[A-Z\s]+:/, '').trim();
                    }

                    newWarnings.push({ section: sectionName, content });
                } catch (sectionError) {
                    console.error(`Error processing section ${sectionName}:`, sectionError);
                    newWarnings.push({ section: sectionName, content: `Error retrieving ${sectionName} information.` });
                }
            }

            console.log(newWarnings);
        } else {
            console.log('No results found for the specified drug.');
        }
    } catch (error) {
        console.error('Error fetching warning data:', error);
    }
};

// Example drug name
const drugName = "Morphine"; // Replace with the drug name you want to test

// Call the function with the example drug name
fetchWarningsDebug(drugName);
