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
import AltConversionTool from '../Pages/AltConversionTool';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';
import PoIvConversionTool from '../Pages/PoIvConversionTool';


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

            // Exit early if the focused element is not inside any tab content
            if (!tabContentElement) return;

            const focusableElements = Array.from(
                tabContentElement.querySelectorAll('input, button, select, textarea, [tabindex]:not([tabindex="-1"])')
            );

            // Exit early if there are no focusable elements
            if (focusableElements.length === 0) return;

            const lastElement = focusableElements[focusableElements.length - 1];
            const firstElement = focusableElements[0];

            // Shift + Tab: Move to the previous tab if on the first element
            if (event.shiftKey && focusedElement === firstElement) {
                event.preventDefault();
                const newActiveTab = activeTab === 0 ? frames.length - 1 : activeTab - 1;
                setActiveTab(newActiveTab);
                setTimeout(() => focusFirstInputInTab(newActiveTab), 0);
            }
            // Tab: Move to the next tab if on the last element
            else if (!event.shiftKey && focusedElement === lastElement) {
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

    const handleFocus = (event) => {
        const focusedElement = event.target;
        const tabContentElement = focusedElement.closest('.tab-content');

        // If the focused element is not inside any tab content, do nothing
        if (!tabContentElement) return;

        // Find the index of the tab content
        const tabIndex = Array.from(document.querySelectorAll('.tab-content')).indexOf(tabContentElement);

        // If a valid tab index is found, update the active tab
        if (tabIndex !== -1 && tabIndex !== activeTab) {
            setActiveTab(tabIndex);
        }
    };

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyboardNavigation);
        document.addEventListener('focusin', handleFocus);
        return () => {
            window.removeEventListener('keydown', handleKeyboardNavigation);
            document.removeEventListener('focusin', handleFocus);
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
                        <ListItemButton sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Link to='/po-iv' style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                                <ListItemIcon>
                                    <VaccinesIcon />
                                </ListItemIcon>
                                <ListItemText primary="PO:IV Conversion" />
                            </Link>
                            <IconButton onClick={() => addFrame("Po:IV Conversion", <PoIvConversionTool />)}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </ListItemButton>

                        <ListItemButton sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Link to='/alt' style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                                <ListItemIcon>
                                    <BalanceIcon />
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
                    {/* Conditionally render the Tabs only if there are more than one frame */}
                    {frames.length > 1 && (
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
                    )}

                    {/* Render the content */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            padding: 2,
                            overflow: 'auto',
                            display: 'flex',
                            justifyContent: frames.length > 1 ? 'flex-start' : 'center',
                        }}
                    >
                        {frames.length > 1 ? (
                            frames.map((frame) => (
                                <Box
                                    key={frame.id}
                                    className="tab-content"
                                    sx={{
                                        flexShrink: 0,
                                        border: frame.id === activeTab ? '2px solid #1976d2' : '1px solid #ccc',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginRight: '16px',
                                    }}
                                >
                                    {frame.component}
                                </Box>
                            ))
                        ) : (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    padding: '16px',
                                }}
                            >
                                {children}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}