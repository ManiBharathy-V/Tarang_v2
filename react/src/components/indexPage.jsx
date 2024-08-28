import React from 'react'
import { AppBar, Typography, Container,Box , Toolbar, Tabs, Tab } from '@mui/material'
import { useState } from 'react'
import Login from '../indexHome-pages/login'
import Register from '../indexHome-pages/register'
import "../components/homeHeader.css";
import logo from '../assets/TarangLogoCropped.png';

const routes = ["Home", "Services", "AboutUs", "ContactUs", "LogIn", "Register"]

function renderComponent(route) {
    switch (route) {
        case "Home":
            return <div>Home Page</div>
        case "Services":
            return <div>Services Page</div>
        case "AboutUs":
            return <div>AboutUs Page</div>
        case "ContactUs":
            return <div>ContactUs Page</div>
        case "LogIn":
            return <Login />
        case "Register":
            return <Register />
        default:
            return <div>404 Page not found</div>

    }
}

function IndexPage() {

    const [selected, setSelected] = useState(routes[0]);

    return (
        <div className="indexpage">
            <AppBar position='static' color='secondary'>
                <Toolbar><Box
                    component="img"
                    sx={{
                        height: 40, // adjust as needed
                        marginRight: 2, ml:3,
                    }}
                    alt="Logo"
                    src={logo}
                />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        T A R A N G
                    </Typography>
                    <Tabs value={selected} textColor="inherit" indicatorColor="" onChange={(_e, newValue) => setSelected(newValue)}>
                        {routes.map((route, index) => (<Tab label={route} key={route} value={route} />))}
                    </Tabs>
                </Toolbar>
            </AppBar>
            <Container sx={{ marginTop: 4 }}>
                {renderComponent(selected)}
            </Container>
        </div>
    )
}

export default IndexPage