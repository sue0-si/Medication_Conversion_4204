// JavaScript source code
import React from "react";

function parseContent(content) {
    // Replace extra parentheses and commas
    content = content.replace(/[(),]/g, '');

    // Split into sentences or sections by dots and specific markers
    const sections = content.split(/\d\.\d|\n/); // Matches numbered sections or newlines

    return sections.map(section => section.trim()).filter(Boolean); // Remove empty strings
}
function extractSections(content) {

    const regex = /(\d\.\d+.*?)(?=\d\.\d+|$)/g; // Matches sections with their content
    const matches = content.match(regex);

    return matches
        ? matches.map(section => {
            const [title, ...body] = section.split(/\n/);
            return {
                title: title?.trim(),
                body: body.join(' ').trim(),
            };
        })
        : [];
}

export default function DataTable({ dataString }) {
    //let data = dataString.split('\u2022');
    //let heading = data.shift().slice(2);
    const parsedSections = extractSections(dataString);

    //return (
    //    <div>
    //        <table border="1">
    //            <thead>
    //                <tr>
    //                    <th>{heading}</th>
    //                </tr>
    //            </thead>
    //            <tbody>
    //                {dataString.map((item, index) => (
    //                    <tr key={index}>
    //                        <td>{item}</td>
    //                    </tr>
    //                ))}
    //            </tbody>
    //        </table>
    //    </div>
    //);
    return (
        <div>
            {parsedSections.map((section, index) => (
                <div key={index}>
                    <h2>{section.title}</h2>
                    <p>{section.details}</p>
                </div>
            ))}
        </div>
    );
}