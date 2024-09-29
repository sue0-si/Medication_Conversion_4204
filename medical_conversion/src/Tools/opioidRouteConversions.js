    // Import the opioids JSON file
const opioids = require('../tools/opioids.json');

// Initialize the object to store route conversions
const opioidRouteConversions = {};

// Helper function to add route conversions for each drug
function addRouteConversions(drugData, drugName) {
    const routeConversions = drugData["route_conversions"];
    if (routeConversions) {
        opioidRouteConversions[drugName] = {};

        // Loop through each route conversion and store them
        Object.keys(routeConversions).forEach((route) => {
            const [firstAdminType, targetAdminType] = route.split('_to_');
            if (!opioidRouteConversions[drugName][firstAdminType]) {
                opioidRouteConversions[drugName][firstAdminType] = {};
            }
            opioidRouteConversions[drugName][firstAdminType][targetAdminType] = routeConversions[route];
        });
    }
}

// Loop through the opioids JSON and populate the route conversion structure
Object.keys(opioids).forEach((drugName) => {
    addRouteConversions(opioids[drugName], drugName);
});

// Export the drug route conversion structure for use in other parts of the app
module.exports = opioidRouteConversions;