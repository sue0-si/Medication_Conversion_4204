// JavaScript source code
import React from "react";



export default function DataTable({ dataString }) {
    let data = dataString.split('\u2022');
    let heading = data.shift().slice(2);
    return (
        <div>
            <table border="1">
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