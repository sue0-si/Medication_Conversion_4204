import React from "react";

export default function DataTable({ dataString }) {
    let data = [];
    let heading = "Details";

    if (dataString.includes('\u2022')) {
        // Handle bullet points
        data = dataString.split('\u2022');
        heading = data.shift();
    } else if (/\d\.\d/.test(dataString)) {
        // Handle sections like "2.1" or "3.2"
        data = dataString.split(/(?=\d\.\d)/);
    } else if (dataString.includes(".")) {
        // Split into sentences if no other delimiters exist
        data = dataString.split(". ").map(sentence => sentence.trim());
    } else {
        // Fallback: Split into chunks of 100 characters for long strings
        data = dataString.match(/.{1,100}/g) || [];
    }

    // Clean up and filter unnecessary placeholder sections
    data = data
        .map(item => item.replace(/[\(\)]/g, "").trim()) // Remove parentheses and trim
        .filter(item =>
            item.length > 3 && // Remove very short items
            !/^\d\.\d,?$/.test(item) // Exclude placeholder-like items (e.g., "2.1," or "2.1")
    );

    // Clean up and filter unnecessary placeholder sections
    data = data
        .map(item => item.trim()) // Remove leading/trailing whitespace
        .filter(item =>
            item.length > 3 && // Exclude very short items
            !/^\d\.\d\s*,?$/.test(item) // Match placeholders like "2.1 ," or "2.1,"
        );

    return (
        <div>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>{heading}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
