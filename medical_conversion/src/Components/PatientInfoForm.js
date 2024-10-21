import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import * as React from "react";

function PatientInfoForm({ patientData, setPatientData }) {
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
        const newData = {
            ...patientData,
            [name]: type === "checkbox" ? checked : value,
        };
        setPatientData(newData);

        // Save to local storage whenever data changes
        /*localStorage.setItem("patientData", JSON.stringify(newData));*/
    };

    

    return (
        <div>
            <TextField
                label="Height (cm)"
                name="height"
                value={patientData.height || 0}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
            <TextField
                label="Weight (kg)"
                name="weight"
                value={patientData.weight || 0}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                    name="gender"
                    value={patientData.gender || ''}
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
                        checked={!!patientData.pregnant}
                        onChange={handleChange}
                        disabled={patientData.gender !== 'female'}
                    />
                }
                label="Pregnant"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="liver"
                        checked={!!patientData.liver}
                        onChange={handleChange}
                    />
                }
                label="Liver Impairment"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="kidney"
                        checked={!!patientData.kidney}
                        onChange={handleChange}
                    />
                }
                label="Kidney Impairment"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="gastro"
                        checked={!!patientData.gastro}
                        onChange={handleChange}
                    />
                }
                label="GI Impairment"
            />
            <TextField
                label="Existing Disease"
                name="disease"
                value={patientData.disease || ''}
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
//    {label: "Gender", name: "gender", type:"text"},
//    {label: "Marital Status", name: "marital status", type:"text"},
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
