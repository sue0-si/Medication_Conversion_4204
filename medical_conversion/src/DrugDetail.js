import React from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import IconButton from '@mui/material/IconButton';
import Dashboard from "./Dashboard";

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
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // go back
    };

    return (
        <Dashboard heading='Medication Information'>
            <Box sx={{ width: '100%', padding: 3 }}>
                <IconButton onClick={handleBack}>
                    <ChevronLeftIcon />
                    <p>Go Back</p>
                </IconButton>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="drug detail tab">
                        <Tab label="Dosage Guideline" value={0} />
                        <Tab label="Side Effect" value={1} />
                        <Tab label="Drug interaction" value={2} />
                        <Tab label="Treatement indication" value={3} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    ZOSYN® (piperacillin and tazobactam) Injection is supplied in GALAXY Containers as a frozen, iso-osmotic, sterile, non-pyrogenic solution in single-dose plastic containers:
                    <br></br>
                    2.25 g (piperacillin sodium equivalent to 2 g piperacillin and tazobactam sodium equivalent to 0.25 g tazobactam) in 50 mL.
                    <br></br>
                    3.375 g (piperacillin sodium equivalent to 3 g piperacillin and tazobactam sodium equivalent to 0.375 g tazobactam) in 50 mL.
                    <br></br>
                    4.5 g (piperacillin sodium equivalent to 4 g piperacillin and tazobactam sodium equivalent to 0.5 g tazobactam) in 100 mL.
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    The following clinically significant adverse reactions are described elsewhere in the labeling:
                    <li>Hypersensitivity Reactions</li>
                    <li>QT Prolongation</li>
                    <li>Serotonin Syndrome</li>
                    <li>Myocardial Ischemia </li>
                    <li>Masking of Progressive Ileus and Gastric Distension </li>

                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Serotonergic Drugs: Combining Zofran with other serotonergic drugs (such as SSRIs, SNRIs, and MAOIs) can increase the risk of serotonin syndrome.
                    <br></br>
                    QT Prolonging Drugs: Drugs that prolong the QT interval, such as certain antiarrhythmics, antipsychotics, and antibiotics, can lead to an increased risk of cardiac arrhythmias when used with Zofran.
                    <br></br>
                    Apomorphine: This combination can cause severe hypotension and loss of consciousness.
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    Prevention of nausea and vomiting associated with:
                    <li>Chemotherapy</li>
                    <li>Radiation therapy</li>
                    <li>Surgery</li>
                    <br></br>
                    Off-label uses may include treatment for:
                    <li>Gastroenteritis-related nausea and vomiting</li>
                    <li>Pregnancy-related nausea (morning sickness)</li>
                    <li>Nausea and vomiting due to various medical conditions</li>
                </CustomTabPanel>
            </Box>
        </Dashboard>
       

    )
}

export default DrugDetail;