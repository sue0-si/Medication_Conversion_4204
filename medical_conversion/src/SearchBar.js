// JavaScript source code
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useNavigate } from 'react-router-dom';




function SearchBar({ setSearchQuery }) {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const handleSubmit = event => {

        event.preventDefault();

        // 👇️ Redirect to /contacts
        navigate('/medication-information/' + value);
    };
    return (

    <div style={{ padding: 30 }}>
            <form onSubmit={handleSubmit}>
            <TextField
                id="search-bar"
                className="text"
                onInput={(e) => {
                    setSearchQuery(e.target.value);
                    setValue(e.target.value);
                }}
                label="Enter a medication name"
                variant="outlined"
                placeholder="Search..."
                size="small"
            />
            <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "blue" }} />
            </IconButton>
        </form>
    </div>
);
}

export default SearchBar;