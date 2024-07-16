import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Logo from './images/Scales.png';

const logoStyle = {
    width: '100px',
    height: 'auto',
    cursor: 'pointer',
};

function NavBar({ mode, toggleColorMode }) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const scrollToSection = (sectionId) => {
        const sectionElement = document.getElementById(sectionId);
        const offset = 128;
        if (sectionElement) {
            const targetScroll = sectionElement.offsetTop - offset;
            sectionElement.scrollIntoView({ behavior: 'smooth' });
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth',
            });
            setOpen(false);
        }
    };

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        variant="regular"
                        sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                            borderRadius: '999px',
                            bgcolor:
                                theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(24px)',
                            maxHeight: 40,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow:
                                theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                        })}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                ml: '-18px',
                                px: 0,
                            }}
                        >
                            <img
                                src={
                                    Logo
                                }
                                style={logoStyle}
                                alt="logo of sitemark"
                            />
                            
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-evenly"
                                alignItems="center"
                            >
                            
                                <Grid item>

                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        component="a"
                                        href=""
                                        target="_blank"
                                    >
                                        Medication Information
                                    </Button>
                                </Grid>
                                <Grid item>

                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        component="a"
                                        href=""
                                        target="_blank"
                                    >
                                        IV:PO Conversion
                                    </Button>
                                </Grid>
                                <Grid item>

                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        component="a"
                                        href=""
                                        target="_blank"
                                    >
                                        Alternative Med. Conv.
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

NavBar.propTypes = {
    mode: PropTypes.oneOf(['dark', 'light']).isRequired,
    toggleColorMode: PropTypes.func.isRequired,
};

export default NavBar;