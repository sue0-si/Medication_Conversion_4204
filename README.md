# Medication_conversion
Converting IV to Oral formulations and vice versa.

# Release Notes

## Version 0.1.0

### Features
- Alert dialog component when the conversion result has a potential health hazard
- Input field to enter medication information
- Optional field for patient data
  
### Bug Fixes
N/A

### Known Issues
- Comprehensive formula list (no existing APIs)
- No centralized tabular data for drug warnings associated with specific patient history.

## Version 0.2.0

### Features
- CSV tables to store known converison rates
- Results UI for medication data, patient data, conversion info, warnings, and administration instructions
- Single page structure for forms and results
  
### Bug Fixes
- removed unfinished additions to FormatForTable Tool
- removed unused PatientVariableForm

### Known Issues
- dependant on CSV for calculations
- API services yet to be linked