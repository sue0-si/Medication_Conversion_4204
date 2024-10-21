import React, { useState } from "react";
import WarningIcon from '@mui/icons-material/Warning';

const styles = {
    container: {
      margin: '1.5em',
      padding: '1em',
      borderLeft: 'solid 0.2em',
      borderColor: 'red',
      backgroundColor: 'rgb(252, 219, 215)',
      width: '32em',
      height: 'auto',
    },
    alignContainer: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'start',
    },
    icon: {
      marginRight: '8px',
      color: 'red',
    },
    text: {
      fontSize: '16px',
      color: 'rgb(247, 109, 109)',
    },
    spanText: {
      fontSize: '16px',
      color: 'rgb(247, 109, 109)',
      marginLeft: '2em',
    },
    button: {
      color: 'white',
      borderColor: 'rgb(245, 76, 76)',
      borderStyle: 'solid',
      borderRadius: '3px',
      backgroundColor: 'rgb(245, 76, 76)',
      marginLeft: '2em',
      width: '5em',
      height: '2em'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'right'
    }
  };

export default function AlertDialog({ warning, onOkay }) {
    return(
        <div style={styles.container}>
            <div style={styles.alignContainer}>
                <WarningIcon style={styles.icon}></WarningIcon>
                <span style={styles.text}><strong>Caution</strong></span>
            </div>
            <p style={styles.spanText}>{warning}</p>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={onOkay}>Okay</button>
            </div>
        </div>
    );
}