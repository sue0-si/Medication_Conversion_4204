// src/components/DrugWarnings.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DRUGS = [
  "Betamethasone",
  "Cortisone",
  "Dexamethasone",
  "Hydrocortisone",
  "Methylprednisolone",
  "Prednisolone",
  "Prednisone",
  "Triamcinolone",
  "Morphine",
  "Oxycodone",
  "Codeine",
  "Dihydrocodeine",
  "Tramadol",
  "Fentanyl",
  "Buprenorphine",
  "Alfentanil",
  "Hydromorphone",
  "Bupivacaine",
  "Lidocaine",
  "Mepivacaine",
  "Ropivacaine",
  "Diazepam",
  "Alprazolam",
  "Clonazepam",
  "Lorazepam",
  "Oxazepam",
  "Temazepam",
  "Triazolam",
  "Flurazepam",
  "Chlordiazepoxide",
  "Midazolam",
  // Add other drugs as necessary
];

function DrugWarnings({ patientData }) {
  const [warnings, setWarnings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrugWarnings = async (drug) => {
    try {
      const response = await axios.get(
        `https://api.fda.gov/drug/label.json`,
        {
          params: {
            search: `openfda.brand_name:"${drug}" OR openfda.generic_name:"${drug}"`,
            limit: 1,
          },
        }
      );
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0];
      } else {
        return null;
      }
    } catch (err) {
      console.error(`Error fetching data for ${drug}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const getWarnings = async () => {
      setLoading(true);
      setError(null);
      const warningsData = {};

      for (let drug of DRUGS) {
        const data = await fetchDrugWarnings(drug);
        warningsData[drug] = data;
      }

      setWarnings(warningsData);
      setLoading(false);
    };

    getWarnings();
  }, []);

  const extractSection = (data, sectionName) => {
    if (!data || !data.sections) return null;
    const section = data.sections.find(
      (sec) => sec.toLowerCase() === sectionName.toLowerCase()
    );
    if (section) {
      return data[section];
    }
    return null;
  };

  const getWarningContent = (drug, section) => {
    const drugData = warnings[drug];
    if (!drugData) return null;
    const content = extractSection(drugData, section);
    return content || "No information available.";
  };

  const isGeriatric = patientData.age > 65;
  const isPediatric = patientData.age < 18;
  const isPregnant = patientData.pregnant;

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      {DRUGS.map((drug) => (
        <Box key={drug} mb={4}>
          <Typography variant="h5" gutterBottom>
            {drug}
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Boxed Warning</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {getWarningContent(drug, "boxed_warning")}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Do Not Use</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {getWarningContent(drug, "do_not_use")}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Drug Interaction</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {getWarningContent(drug, "drug_interactions")}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>When Using</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {getWarningContent(drug, "when_using")}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Additional Warnings Based on Patient Info */}
          {(isGeriatric || isPediatric || isPregnant) && (
            <Box mt={2}>
              <Typography variant="h6">Additional Warnings</Typography>
              {isGeriatric && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Geriatric Use</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {getWarningContent(drug, "geriatric")}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {isPediatric && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Pediatric Use</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {getWarningContent(drug, "pediatric")}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              {isPregnant && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Pregnancy</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {getWarningContent(drug, "pregnancy")}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </Box>
      ))}
    </div>
  );
}

export default DrugWarnings;
