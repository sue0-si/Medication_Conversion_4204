# Medication_conversion
Converting IV to Oral formulations and vice versa.

# Release Notes

## Version 0.1.0

### New Features
- Alert dialog component when the conversion result has a potential health hazard
- Input field to enter medication information
- Optional field for patient data
  
### Bug Fixes
N/A

### Known Issues
- Comprehensive formula list (no existing APIs)
- No centralized tabular data for drug warnings associated with specific patient history.

## Version 0.2.0

### New Features
- CSV tables to store known converison rates
- Results UI for medication data, patient data, conversion info, warnings, and administration instructions
- Single page structure for forms and results
  
### Bug Fixes
- removed unfinished additions to FormatForTable Tool
- removed unused PatientVariableForm

### Known Issues
- dependant on CSV for calculations
- API services yet to be linked

## Version 0.3.0

### New Features
- added Alternative Medication Conversion tool page
- form submission errors pop-up

  
### Bug Fixes
- fixed form validation errors and ensured all fields are required
- restored previous sprint works and merged into main

### Known Issues
- previous issues still apply

## Version 0.4.0

### New Features
- Formula and Medication Name selection tools that present options and can be searched
- Field options are updated dynamically as form is filled

  
### Bug Fixes
-

### Known Issues
- selection option filering needs to be updated to present relevent types based on route