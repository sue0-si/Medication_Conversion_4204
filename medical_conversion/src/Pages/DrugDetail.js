import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import DataTable from "../Components/ApiDataTable.js";
import Dashboard from "../Components/Dashboard.js";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
}
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const DrugDetail = () => {
    const [value, setValue] = useState(0);
    const [drugData, setDrugData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Extract drug name from the URL path
    const drugName = location.pathname.split('/').pop();

    console.log("DrugDetail rendered with drug name:", drugName);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleBack = () => {
        //return to search
        navigate('/medication-information');
    };

    useEffect(() => {
        const fetchDrugData = async () => {
            console.log("Fetching drug data for:", drugName);
            const timeoutDuration = 10000; // 10 seconds
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timed out')), timeoutDuration)
            );

            try {
                const encodedDrugName = encodeURIComponent(drugName);
                console.log("Encoded drug name:", encodedDrugName);
                console.log(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodedDrugName}"&limit=1`);
                const responsePromise = axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodedDrugName}"&limit=1`);
                const response = await Promise.race([responsePromise, timeoutPromise]);
                
                console.log("API response:", response);
                
                if (response.data.results && response.data.results.length > 0) {
                    setDrugData(response.data.results[0]);
                } else {
                    throw new Error("No data found for this drug");
                }
            } catch (error) {
                console.error("Error fetching drug data:", error);
                setError(error);
            } finally {
                console.log("Setting loading to false");
                setLoading(false);
            }
        };

        if (drugName) {
            fetchDrugData();
        } else {
            console.log("No drug name provided");
            setError(new Error("No drug name provided"));
            setLoading(false);
        }
    }, [drugName]);

    if (loading) return <Dashboard heading='Medication Information'><p>Loading...</p></Dashboard>;
    if (error) return <Dashboard heading='Medication Information'><p>Error: {error.message}</p></Dashboard>;

    const {
        dosage_and_administration,
        adverse_reactions,
        drug_interactions,
        indications_and_usage
    } = drugData;
    
    

    return (
        <Dashboard heading='Medication Information'>
            <Box sx={{ width: '100%', padding: 3 }}>
                <IconButton onClick={handleBack}>
                    <ChevronLeftIcon />
                    <p>Return To Search</p>
                </IconButton>
                <h1>{drugName.charAt(0).toUpperCase() + drugName.slice(1)}</h1>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="drug detail tab">
                        <Tab label="Dosage Guideline" value={0} />
                        <Tab label="Side Effect" value={1} />
                        <Tab label="Drug interaction" value={2} />
                        <Tab label="Treatment indication" value={3} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    {dosage_and_administration ? <DataTable dataString={dosage_and_administration[0]} /> : "No dosage guideline available"}
                    {/*<DataTable dataString={dosage_and_administration[0]}/>*/}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    {adverse_reactions ? <DataTable dataString={adverse_reactions[0]} /> : "No side effect information available"}
                    {/*<DataTable dataString={adverse_reactions[0]} />*/}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    {drug_interactions ? <DataTable dataString={drug_interactions[0]} /> : "No drug interaction information available"}
                    {/*<DataTable dataString={drug_interactions[0]} />*/}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    {indications_and_usage ? <DataTable dataString={indications_and_usage[0]} /> : "No treatment indication available"}
                    {/*<DataTable dataString={indications_and_usage[0]} />*/}
                </CustomTabPanel>
            </Box>
        </Dashboard>
    );
};

export default DrugDetail;