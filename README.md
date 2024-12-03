# Medication_conversion
Converting IV to Oral formulations and vice versa.

# Installation Guide

## Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (comes with Node.js)
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)

You can check if Node.js and npm are installed by running:
```bash
node -v
npm -v
```

## Getting Started
1. Clone the Repository
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
2. Install dependencies
   ```bash
   # Using npm
    npm install
    
    # Or using yarn
    yarn install
   ```
3. Start the development server
   ```bash
   # Using npm
   npm start
    
   # Or using yarn
   yarn start
   ``` 

# Release Notes
## Version 1.0

### New Features
- Instructions of how to use the website
- Formula and Medication Name selection tools that present options and can be searched
- PO-IV conversion
- Medication look-up
- Feature to add additional conversion calculation tools to any page for comparisons
- alternative medication conversion for same drug class


### Bug Fixes
- removed unused imports that generate an error
- fixed patient information parsing error
- selection option filtering updated to present relevant options based on route (opiods)
- fixed form validation errors and ensured all fields are required

### Known Issues
- need to make formula selection more clear (is it based off of drug inputs, formula selection, or new formula creation)
- validate the data with professionals
