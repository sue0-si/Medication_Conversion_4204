# Medication Conversion Application

A supportive tool designed to assist healthcare professionals in converting between IV and oral medication
formulations, calculating precise dosages, identifying alternative medications, and promoting patient safety
with alerts and guidelines. While powerful and user-friendly, this application is intended to complement—not
replace—the expertise and judgment of licensed medical practitioners.

---

# Release Notes  

## Version 1.0.0  

### New Features  
- **Medication Conversion Tools**:  
  Seamlessly perform IV-to-oral and oral-to-IV dosage conversions with a clear and intuitive interface.  

- **Alternative Medication Conversions**:  
  Calculate equivalent dosages for alternative medications, offering flexibility when substitutions are needed.

- **Medication Information Search**: <br>
  Quick search for dosage guidelines, side effects, and administration methods for each medication.

- **Dynamic Form Updates**: 
  Form fields and options adapt dynamically to user inputs, ensuring relevant and accurate information is always displayed.  

- **Multi-Tool Windows**:  
  Open multiple instances of the tool for side-by-side comparisons and parallel dosage calculations.  

- **Patient Safety Alerts**:  
  Built-in warnings for potential health hazards ensure patient safety remains a top priority.  

- **Customizable Formula Selection**:  
  Select pre-existing formulas or create new ones tailored to specific medications and unique scenarios.  

- **Comprehensive Results Display**:  
  Consolidated view of medication details, patient information, dosage conversions, safety warnings, and 
- administration instructions in one easy-to-read layout.  

- **Centralized Data Management**:  
  Supports CSV-based storage for conversion rates and is ready for API integration to access up-to-date medication data.  

### Known Issues  
- The formula selection process could benefit from clearer guidance on when it is influenced by drug inputs,
- manual selection, or new formula creation.  

---

## Intended Use  

This application is designed to assist healthcare professionals by simplifying and enhancing medication-related 
calculations and decisions. It is not a substitute for medical training, clinical experience, or professional judgment.
Users should validate the outputs of the application and consult appropriate medical references or colleagues as needed.  


# Installation Guide

This guide walks you through setting up DoseInfo on your local system.

## Prerequisites

Ensure your system meets the following requirements before proceeding:

1. **Install Node.js:**
   - Download and install Node.js from the [official website](https://nodejs.org/). The LTS version is recommended for
   - stability.
   - During installation, ensure the option to install npm (Node Package Manager) is selected, as it is required for 
   - managing dependencies.

2. **Install a Code Editor (optional but recommended):**
   - Download and install [Visual Studio Code](https://code.visualstudio.com/). It’s a lightweight, efficient 
   - editor for JavaScript-based projects.

3. **Verify Installations:**
   - Open your terminal or command prompt and run the following commands to verify that Node.js and npm are installed:
     ```
     node -v
     npm -v
     ```
   - The output should display the version numbers of Node.js and npm.

---

## Step-by-Step Installation

1. **Clone the Repository:**
   - Open a terminal or command prompt and navigate to the directory where you want to store the project.
   - Run the following command to clone the repository:
     ```
     git clone https://github.com/sue0-si/Medication_Conversion_4204.git
     ```
   - Navigate to the project folder:
     ```
     cd medication_conversion
     ```

2. **Install Project Dependencies:**
   - Use npm to install the necessary dependencies. Run the following command:
     ```
     npm install --force
     npm install groq-sdk --force
     ```
   - This will download and install all required packages listed in the `package.json` file.

3. **Start the Development Server:**
   - Run the following command to start the application:
     ```
     npm start
     ```
   - The application will start, and a local development server will be launched. By default, the server will be 
   - accessible at:
     [http://localhost:3000].

---
