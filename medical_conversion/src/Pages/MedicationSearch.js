import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../Components/SearchBar";
import SearchResult from "../Components/SearchResult";
import Dashboard from "../Components/Dashboard";
import axios from 'axios';

const filterData = (query, data) => {
    if (!query) {
        return data;
    } else {
        return data.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    }
};

// Function to fetch data from Wikipedia API
const fetchWikipediaSummary = async (name) => {
    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
        let description = response.data.extract;
        if (description.length > 630) {
            description = description.substring(0, 627) + '...';
        }
        return description;
    } catch (error) {
        console.error(`Error fetching summary for ${name}:`, error);
        return 'Description not found';
    }
};

const MedicationLookup = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const data = [
        "Acetaminophen",
        "Amoxicillin",
        "Aspirin",
        "Atorvastatin",
        "Azithromycin",
        "Captopril", "Ceftriaxone",
        "Ciprofloxacin",
        "Clindamycin",
        "Clonidine",
        "Dexamethasone",
        "Digoxin",
        "Diltiazem",
        "Enalapril",
        "Furosemide",
        "Gabapentin",
        "Glipizide",
        "Heparin",
        "Hydrocodone",
        "Ibuprofen",
        "Insulin",
        "Lisinopril",
        "Losartan",
        "Metformin",
        "Metoprolol",
        "Naproxen",
        "Omeprazole",
        "Ondansetron",
        "Oxycodone",
        "Prednisone",
        "Ranitidine",
        "Simvastatin",
        "Spironolactone",
        "Tramadol",
        "Vancomycin",
        "Warfarin"

    ];

    const rxValues = [
        "15.31",
        "12.35",
        "35.32",
        "21.74",
        "18.76"   
    ];

    useEffect(() => {
        const fetchMedications = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchPromises = data.map(async (name, index) => {
                    console.log(`Fetching summary for ${name}`);
                    const description = await fetchWikipediaSummary(name);
                    console.log(`Description for ${name}:`, description);

                    const rxValue = rxValues[index];

                    return { name, description, rxValue };
                });

                const results = await Promise.all(fetchPromises);
                console.log('Fetch results:', results);

                setMedications(results);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching medication information:', error);
                setError('Error fetching medication information');
                setLoading(false);
            }
        };

        fetchMedications();
    }, []);

    const dataFiltered = filterData(searchQuery, medications);
    console.log('Filtered data:', dataFiltered);

    const handleItemClick = (name) => {
        navigate(`/medication-information/${name.toLowerCase()}`);
    };

    return (
        <Dashboard heading='Medication Information'>
            <div>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div style={{ padding: 3 }}>
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {dataFiltered.map((d, i) => (
                        <SearchResult
                            key={i}
                            value={d.name}
                            desc={d.description}
                            rxValue={d.rxValue}
                            onClick={() => handleItemClick(d.name)}
                        />
                    ))}
                </div>
            </div>
        </Dashboard>
    );
};

export default MedicationLookup;
