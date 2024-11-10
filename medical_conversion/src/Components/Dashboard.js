// JavaScript source code
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BalanceIcon from '@mui/icons-material/Balance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SplitPane from 'react-split-pane';
import AltConversionTool from '../Pages/AltConversionTool';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';


//width of open nav pannel
const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'fixed',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();

//implementation: <Dashboard heading='PageTitle'> <children/> </Dashboard>

export default function Dashboard({children, heading}) {
    const [open, setOpen] = React.useState(false);
    const [frames, setFrames] = React.useState([{ id: 0, title: 'Main', component: children }]);
    const [activeTab, setActiveTab] = React.useState(0);
    
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Function to add a new frame
    const addFrame = (title, component) => {
        const formattedTitle = title + " " + frames.length;
        const newFrame = { id: frames.length, title: formattedTitle, component };
        setFrames([...frames, newFrame]);
        setActiveTab(frames.length); // Switch to the newly added frame
    };

    // Function to close a frame
    const closeFrame = (id) => {
        const updatedFrames = frames.filter((frame) => frame.id !== id);
        setFrames(updatedFrames);
        setActiveTab(0); // Switch back to the main content
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };


    const handleKeyboardNavigation = (event) => {
        if (event.key === 'Tab') {
            const focusedElement = document.activeElement;

            const tabContentElement = focusedElement.closest('.tab-content');

            // If tabContentElement is null, exit the function early
            if (!tabContentElement) return;

            const focusableElements = Array.from(
                focusedElement
                    .closest('.tab-content')
                    .querySelectorAll('input, button, select, textarea, [tabindex]:not([tabindex="-1"])')
            );

            const lastElement = focusableElements[focusableElements.length - 1];
            const firstElement = focusableElements[0];

            if (event.shiftKey && focusedElement === firstElement) {
                event.preventDefault();
                const newActiveTab = activeTab === 0 ? frames.length - 1 : activeTab - 1;
                setActiveTab(newActiveTab);
                setTimeout(() => focusFirstInputInTab(newActiveTab), 0);
            } else if (!event.shiftKey && focusedElement === lastElement) {
                event.preventDefault();
                const newActiveTab = activeTab === frames.length - 1 ? 0 : activeTab + 1;
                setActiveTab(newActiveTab);
                setTimeout(() => focusFirstInputInTab(newActiveTab), 0);
            }
        }
    };

    const focusFirstInputInTab = (tabIndex) => {
        const tabContent = document.querySelectorAll('.tab-content')[tabIndex];
        if (tabContent) {
            const firstInput = tabContent.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstInput) {
                firstInput.focus();
            }
        }
    };

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyboardNavigation);
        return () => {
            window.removeEventListener('keydown', handleKeyboardNavigation);
        };
    }, [activeTab, frames.length]);


    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex'}}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            {heading}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <Link to='/'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </Link>
                        <Link to='/medication-information'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <ManageSearchIcon/>
                                </ListItemIcon>
                                    <ListItemText primary="Medication Information" />
                            </ListItemButton>
                            </Link>
                            <Link to='/po-iv'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <VaccinesIcon/>
                                </ListItemIcon>
                                <ListItemText primary="PO:IV Conversion" />
                            </ListItemButton>
                        </Link>
                        <ListItemButton>
                            <Link to='/alt'>
                                <ListItemIcon>
                                    <BalanceIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Alt. Medication Conversion" />
                            </Link>
                            <IconButton onClick={() => addFrame("Alt Conversion", <AltConversionTool />)}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </ListItemButton>


                        <ListItemButton>
                            <ListItemIcon>
                                <QuestionMarkIcon/>
                            </ListItemIcon>
                            <ListItemText primary="FAQ" />
                        </ListItemButton>
                    </List>
                </Drawer>

                <Box
                    component="main"
                   
                    sx={(theme) => ({
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowX: 'auto',
                        p: 3,
                        marginLeft: open ? `${drawerWidth}px` : theme.spacing(9),
                        maxWidth: '1200px', // Set a maximum width
                        margin: '0 auto',   // Center the content
                        transition: theme.transitions.create('margin', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    })}
                >
                    <Toolbar />
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Open Tabs"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '.Mui-selected': {
                                color: 'primary.main', // Change the color of the selected tab text
                                fontWeight: 'bold',
                            },
                        }}
                    >
                        {frames.map((frame, index) => (
                            <Tab
                                key={frame.id}
                                label={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {frame.title}
                                        {index !== 0 && (
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeFrame(frame.id);
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </div>
                                }
                            />
                        ))}
                        </Tabs>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            padding: 2,
                            overflowX: 'auto',
                            width: '100%',
                        }}
                    >
                        {frames.map((frame) => (
                            <Box
                                key={frame.id}
                                className="tab-content"
                                sx={{
                                    flexShrink: 0,
                                    border: frame.id === activeTab ? '2px solid #1976d2' : '1px solid #ccc', // Highlight border for selected tab
                                    borderRadius: '8px',
                                    padding: '16px',
                                    backgroundColor: frame.id === activeTab ? '#f0f8ff' : 'inherit', // Highlight background for selected tab
                                }}
                            >
                                {frame.component}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}