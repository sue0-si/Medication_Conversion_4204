// JavaScript source code
import React from "react";
import SearchBar from "./SearchBar";
import { useState } from "react";
import SearchResult from "./SearchResult";
import Dashboard from "./Dashboard";

const filterData = (query, data) => {
    if (!query) {
        return data;
    } else {
        return data.filter((d) => d.toLowerCase().includes(query));
    }
};

// data - should be replaced with api
const data = [
    "Morphine",
    "Hydromorphone",
    "Hydrocodone",
    "Oxycodone",
    "Fentanyl"
]

const description = [
    "Description 1",
    "Description 2",
    "Description 3",
    "Description 4",
    "Description 5"
]

const rxValue = [
    "15.31",
    "12.35",
    "35.32",
    "21.74",
    "18.76"   
]

const MedicationLookup = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const dataFiltered = filterData(searchQuery, data);
    return (
        <Dashboard heading='Medication Information'>
            <div>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div style={{ padding: 3 }}>
                    {dataFiltered.map((d, i) => (
                        <SearchResult value={d} desc={description} rxValue={rxValue} id={i}/>   
                    ))}
                </div>
            </div>  
        </Dashboard>
        
    );
};

export default MedicationLookup;