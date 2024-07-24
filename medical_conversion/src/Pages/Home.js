// JavaScript source code
import React from "react";

import Dashboard from "../Components/Dashboard";

const Home = () => {
    return (
        <div>
            <Dashboard heading='Home'>
                <h1>Welcome to our Medication Conversion Tool</h1>
                <p>This application is being created as an educational exercise by a group of Computer Science students at The
                    Georgia Institute of Technology, on behalf of Dr. Rebecca Steinberg MD, Emory University School of Medicine.</p>

                <p>This resource is actively in development, and should not be regarded as professional medical advice. </p>
            </Dashboard>
        </div>
    );
};

export default Home;