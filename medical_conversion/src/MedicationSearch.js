// JavaScript source code
import React from "react";
import SearchBar from "./SearchBar";
import { useState } from "react";

const filterData = (query, data) => {
    if (!query) {
        return data;
    } else {
        return data.filter((d) => d.toLowerCase().includes(query));
    }
};

const data = [
    "Morphine",
    "Hydromorphone",
    "Hydrocodone",
    "Oxycodone",
    "Fentanyl"
]

const MedicationLookup = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const dataFiltered = filterData(searchQuery, data);
    return (
        <div>
            <h1>Medication Lookup</h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div style={{ padding: 3 }}>
                {dataFiltered.map((d) => (
                    <div
                        className="text"
                        style={{
                            padding: 5,
                            justifyContent: "normal",
                            fontSize: 20,
                            color: "blue",
                            margin: 1,
                            width: "250px",
                            BorderColor: "green",
                            borderWidth: "10px"
                        }}
                        key={d.id}
                    >
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicationLookup;