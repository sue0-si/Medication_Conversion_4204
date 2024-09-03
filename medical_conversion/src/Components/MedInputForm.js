// JavaScript source code
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import StartIcon from '@mui/icons-material/Start';
import TextField from "@mui/material/TextField";
import { useNavigate } from 'react-router-dom';




function MedInputForm({ redirectOnSubmit }) {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const handleSubmit = event => {

        event.preventDefault();

        // 👇️ Redirect to results using medication name
        navigate("/po-iv/" + redirectOnSubmit);
    };
    return (

        <div style={{ padding: 30 }}>
            <form onSubmit={handleSubmit}>
                
                <IconButton type="submit" aria-label="submit">
                    <StartIcon style={{ fill: "blue" }} />
                </IconButton>
            </form>
        </div>
    );
}

export default MedInputForm;