import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from "@mui/material";
import DrugDetail from "./DrugDetail";

const SearchResult = (data) => {
    return (
        <ListItem key={data.value.id}>
            <ListItemButton component="a" href="/drug-detail">
                
                    <ListItemText primary={data.value} secondary={
                        <React.Fragment>
                            <Typography sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary">
                                Good Rx Value: ${data.rxValue[data.id]}
                            </Typography>
                        </React.Fragment>
                    } />
                
                <ListItemText primary={data.desc[data.id]} />
            </ListItemButton>
        </ListItem>
    );
};

export default SearchResult;