const opioids = require('../Tools/opioids.json');
const steroids = require('../Tools/steroids.json');
const benzodiazepines = require('../Tools/benzodiazepine.json');
const localAnesthetics = require('../Tools/local_anesthetics.json');

// Initialize an empty object to store the mapping
const drugClassMap = {};
const opioidConversions = {}; // To store route and drug conversions specifically for opioids

// Helper function to extract drug names, classes, and conversions
function addDrugsToMap(drugData) {
    for (const drug in drugData) {
        const drugInfo = drugData[drug];
        const drugClass = drugInfo["class"];

        // Store class information in the drugClassMap
        drugClassMap[drug] = drugClass;

        // If the drug is an opioid, we store its conversions
        if (drugClass === "opioid") {
            opioidConversions[drug] = {
                routeConversions: drugInfo["route_conversions"] || {},
                drugConversions: drugInfo["Conversions"] || {}
            };
        }
    }
}

// Add drugs from all categories
addDrugsToMap(opioids);
addDrugsToMap(steroids);
addDrugsToMap(benzodiazepines);
addDrugsToMap(localAnesthetics);

// Export the map for use in other parts of the application
module.exports = {
    drugClassMap,
    opioidConversions // Export opioid-specific conversions
};