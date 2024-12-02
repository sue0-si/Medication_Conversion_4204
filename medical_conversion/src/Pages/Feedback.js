import React, { useState } from "react";
import Dashboard from '../Components/Dashboard';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

const FeedbackBugReport = () => {
  const [formData, setFormData] = useState({
    type: "feedback", // 'feedback' or 'bug'
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formspreeEndpoint = "https://formspree.io/f/mdkoprqk"; 

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ type: "feedback", name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to send the message. Please try again later.");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Dashboard heading={"Feedback / Bug Report"}></Dashboard>
      <Typography variant="h4" component="h1" gutterBottom>
        Submit Feedback or Report a Bug
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Type:</Typography>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="feedback">Feedback</MenuItem>
            <MenuItem value="bug">Bug Report</MenuItem>
          </Select>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label={
              formData.type === "feedback"
                ? "Write your feedback here..."
                : "Describe the bug you encountered..."
            }
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
        </Box>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit
        </Button>
      </form>

      {submitted && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
        >
          Thank you for your submission!
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FeedbackBugReport;
