import { TextField } from "@mui/material";
import React from "react";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        margin:"1em"
    },
    column: {
        display: "flex",
        alignItems: "center"
    },
    text: {
        margin: "2em", 
        width: "16em",
    }
};

const variableList = [ 
    {label: "Age", name: "age", type:"number"}, 
    {label: "Race", name: "race", type:"text"},
    {label: "Gender", name: "gender", type:"text"},
    {label: "Marital Status", name: "marital status", type:"text"},
    {label: "Body Mass Index (BMI)", name: "BMI", type:"number"},
    {label: "Comorbidity", name: "comorbidity", type:"number"},
    {label: "Length of Stay (LOS)", name: "Length of Stay", type:"number"},
    {label: "Surgical Service", name: "service", type:"text"},
];

export default function PatientVariableForm() {
    
    return(
        <div style={styles.container}>
            <h3>Patient Variable</h3>
            {
                variableList.map((field, index) => (
                    <div key={index} style={styles.column}>
                        <span style={styles.text}>{field.label}</span>
                        <TextField label={field.label} margin="normal" name={field.name} type={field.type}></TextField>
                    </div>
                ))
            }
        </div>
    );
};