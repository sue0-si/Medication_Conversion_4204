import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import * as React from "react";
import { MedicationContext } from "../Tools/MedicationContext";

function PatientInfoForm() {
    const {medicationData, setPatientData} = React.useContext(MedicationContext);
    //useEffect(() => {
    //    // Load patient data from local storage when component mounts
    //    const storedData = localStorage.getItem("patientData");
    //    if (storedData) {
    //        const parsedData = JSON.parse(storedData);
    //        // Merge stored data with initial patientData, preferring stored values
    //        setPatientData(prevData => ({
    //            ...prevData,
    //            ...parsedData
    //        }));
    //    }
    //}, [setPatientData]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setPatientData({
            [name]: type === "checkbox" ? checked : value === "" ? type === "number" ? 0 : value : Number(value),
        });
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;
        if (value === "") {
            setPatientData({
                [name]: 0, // Reset to 0 if the field is left empty
            });
        }
    };
        
    return (
        <div>
            <TextField
                label="Height (cm)"
                name="height"
                value={medicationData.patientData.height || ""}
                onBlur={handleBlur}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
            <TextField
                label="Weight (kg)"
                name="weight"
                value={medicationData.patientData.weight || ""}
                onBlur={handleBlur}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                    name="gender"
                    value={medicationData.patientData.gender || ''}
                    onChange={handleChange}
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        name="pregnant"
                        checked={!!medicationData.patientData.pregnant}
                        onChange={handleChange}
                        disabled={medicationData.patientData.gender !== 'female'}
                    />
                }
                label="Pregnant"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="liver"
                        checked={!!medicationData.patientData.liver}
                        onChange={handleChange}
                    />
                }
                label="Liver Impairment"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="kidney"
                        checked={!!medicationData.patientData.kidney}
                        onChange={handleChange}
                    />
                }
                label="Kidney Impairment"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="gastro"
                        checked={!!medicationData.patientData.gastro}
                        onChange={handleChange}
                    />
                }
                label="GI Impairment"
            />
            <TextField
                label="Existing Disease"
                name="disease"
                value={medicationData.patientData.disease || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </div>
    );
}

export default PatientInfoForm;



//alternate format for rendering, could be more efficient so id like to keep it here to try to make work wiht single page functionality
//import { TextField } from "@mui/material";
//import React from "react";

//const styles = {
//    container: {
//        display: "flex",
//        flexDirection: "column",
//        margin:"1em"
//    },
//    column: {
//        display: "flex",
//        alignItems: "center"
//    },
//    text: {
//        margin: "2em",
//        width: "16em",
//    }
//};

//const variableList = [
//    {label: "Age", name: "age", type:"number"},
//    {label: "Race", name: "race", type:"text"},
//    {label: "Gender", name: "gender", type:"text"},,
//    {label: "Body Mass Index (BMI)", name: "BMI", type:"number"},
//    {label: "Comorbidity", name: "comorbidity", type:"number"},
//    {label: "Length of Stay (LOS)", name: "Length of Stay", type:"number"},
//    {label: "Surgical Service", name: "service", type:"text"},
//];

//export default function PatientVariableForm() {

//    return(
//        <div style={styles.container}>
//            <h3>Patient Variable</h3>
//            {
//                variableList.map((field, index) => (
//                    <div key={index} style={styles.column}>
//                        <span style={styles.text}>{field.label}</span>
//                        <TextField label={field.label} margin="normal" name={field.name} type={field.type}></TextField>
//                    </div>
//                ))
//            }
//        </div>
//    );
//};
