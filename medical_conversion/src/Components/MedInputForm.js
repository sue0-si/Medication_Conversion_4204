import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";

import { useNavigate } from 'react-router-dom';
import PatientInfoForm from "./PatientInfoForm";
import SelectFormula from "./SelectFormula";
import { extractFormulaOptions } from "../Tools/Options";
import SelectMedication from "./SelectMedication";
import { MedicationContext } from "../Tools/MedicationContext"

function MedInputForm({ formtype, onSubmit }) {
  const { medicationData, setMedicationData, setPatientData } = useContext(MedicationContext);
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [altMedOptions, setAltMedOptions] = useState([
    "Please input medication name to see alternative options",
  ]);
  const [formulaOptions, setFormulaOptions] = useState([]);

  useEffect(() => {
    const allOptions = extractFormulaOptions();
    setFormulaOptions(allOptions);
  }, []);

  useEffect(() => {
    if (formtype === "po-iv") {
      setMedicationData((prevData) => ({
        ...prevData,
        target: prevData.name,
      }));
    }
  }, [medicationData.name, formtype, setMedicationData]);

  const getFilteredOptions = () => {
    const filtered = formulaOptions.filter((option) => {
      const isRelevantMedication = option.formulaName
        .toLowerCase()
        .includes(medicationData.name?.toLowerCase());
      const isRelevantRoute =
        !medicationData.route ||
        option.formulaName.toLowerCase().includes(medicationData.route?.toLowerCase());
      return isRelevantMedication && isRelevantRoute;
    });
    return filtered;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMedicationData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMedicationNameChange = (event) => {
    const value = event.target.value;
    setMedicationData((prevData) => ({
      ...prevData,
      name: value,
    }));

    setAltOptions();
  };

  const handleClick = () => {
    setShowPatientForm(!showPatientForm);
    setMedicationData((prevData) => ({
        ...prevData,
        patientData: { 
            ...prevData.patientData,
            showPatientForm: !showPatientForm 
        },
    }));
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = {};
    if (!medicationData.name) validationErrors.name = "Medication name is required.";
    if (!medicationData.dosage) validationErrors.dosage = "Dosage is required.";
    if (!medicationData.dosageUnit) validationErrors.dosageUnit = "Dosage unit is required.";
    if (!medicationData.route) validationErrors.route = "Administration route is required.";
    if (!medicationData.target) validationErrors.target = "Target medication is required.";
    if (!medicationData.targetRoute && formtype === "po-iv")
      validationErrors.targetRoute = "Target administration method is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setOpenErrorDialog(true);
      return;
    }

    setSubmittedData(medicationData);
    onSubmit();
  };

  const handleCloseDialog = () => {
    setOpenErrorDialog(false);
  };

  const setAltOptions = () => {
    if (medicationData.name != null) {
      // Insert API call here to fetch alternative medications

      // Default, if no alternatives found
      setAltMedOptions(["No alternative medication options found."]);
    }
  };

  return (
    <FormControl component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Input Medication Details */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Input Medication Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <SelectMedication field="name" label="Select Source Medication" formtype = {formtype} />

        <FormControl fullWidth margin="normal">
          <Typography variant="Subtitle 1" gutterBottom>
            Administration Method
          </Typography>
          <ToggleButtonGroup
            value={medicationData.route}
            exclusive
            required
            onChange={(event, newMethod) => {
              setMedicationData((prevData) => ({
                ...prevData,
                route: newMethod,
              }));
            }}
            aria-label="administration method"
          >
            <ToggleButton value="oral" aria-label="oral">
              Oral
            </ToggleButton>
            <ToggleButton value="iv" aria-label="iv">
              IV
            </ToggleButton>
            <ToggleButton value="sc" aria-label="sc">
              SC
            </ToggleButton>
          </ToggleButtonGroup>
        </FormControl>

        {/* Dosage Input Field */}
        <TextField
          label="Dosage"
          name="dosage"
          value={medicationData.dosage}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          type="number"
        />

        {/* Dosage Unit Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Dosage Unit</InputLabel>
          <Select
            name="dosageUnit"
            value={medicationData.dosageUnit}
            onChange={handleChange}
            required
          >
            <MenuItem value="mg">mg</MenuItem>
            <MenuItem value="mL">mL</MenuItem>
            <MenuItem value="g">g</MenuItem>
            <MenuItem value="units">units</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Desired Output Medication Details */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Desired Output Medication Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Render target medication select box only if formtype is not "po-iv" */}
        {formtype !== "po-iv" && (
          <SelectMedication field="target" label="Select Target Medication" formtype={formtype}/>
        )}

        {/* PO-IV form */}
        {formtype === "po-iv" && (
          <>
            <FormControl fullWidth margin="normal">
              <Typography variant="Subtitle 1" gutterBottom>
                Desired Administration Method
              </Typography>
              <ToggleButtonGroup
                value={medicationData.targetRoute}
                exclusive
                required
                onChange={(event, newMethod) => {
                  setMedicationData((prevData) => ({
                    ...prevData,
                    targetRoute: newMethod,
                  }));
                }}
                aria-label="target administration method"
              >
                <ToggleButton value="oral" aria-label="oral">
                  Oral
                </ToggleButton>
                <ToggleButton value="iv" aria-label="iv push">
                  IV
                </ToggleButton>
                <ToggleButton value="sc" aria-label="sc">
                  SC
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </>
        )}
      </Box>

      {/* Conversion Formula Selection */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Conversion Formula
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <SelectFormula
          label="Conversion Formula"
          options={getFilteredOptions()}
          medicationData={medicationData}
          setMedicationData={setMedicationData}
        />
      </Box>

      {/* Patient Information */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Patient Information (Optional)
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <FormControl fullWidth margin="normal">
          <Button variant="outlined" onClick={handleClick}>
            {showPatientForm ? "Remove Patient Information" : "Add Patient Information"}
          </Button>

          {showPatientForm && (
            <PatientInfoForm
              patientData={medicationData.patientData}
              setPatientData={setPatientData}
            />
          )}
        </FormControl>
      </Box>

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Submit
      </Button>

      {/* Error Dialog */}
      <Dialog
        open={openErrorDialog}
        onClose={handleCloseDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Submission Errors</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            Please fix the following errors before submitting:
            <ul>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </FormControl>
  );
}

export default MedInputForm;
