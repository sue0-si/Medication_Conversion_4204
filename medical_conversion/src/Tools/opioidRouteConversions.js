import opioids from './opioids.json';

// Create an empty map for storing conversions
const opioidRouteConversions = {};

// Function to add route conversions for a drug, making route names lowercase
const addRouteConversions = (drugName, conversions) => {
    if (!opioidRouteConversions[drugName]) {
        opioidRouteConversions[drugName] = {};
    }

    Object.keys(conversions).forEach((route) => {
        // Split route, lowercase both parts
        const [fromRoute, toRoute] = route.split('_to_').map(r => r.toLowerCase());
        
        if (!opioidRouteConversions[drugName][fromRoute]) {
            opioidRouteConversions[drugName][fromRoute] = {};
        }
        
        // Store the conversion ratio under the lowercase route names
        opioidRouteConversions[drugName][fromRoute][toRoute] = conversions[route];
    });
};

// Process each opioid and add its route conversions
Object.keys(opioids).forEach((drugName) => {
    addRouteConversions(drugName, opioids[drugName].route_conversions);
});

export default opioidRouteConversions;
