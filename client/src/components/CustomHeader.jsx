import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCirle from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { getWeb3 } from '../getWeb3';
import axios from 'axios';

export function CustomHeader() {

    React.useEffect(() => {
        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.replace('/');
        });
    })

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={Link} to='/' sx={{ flexGrow: 1 }}>
                        DonaTrack
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <AccountCirle color="inherit" />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
};

export default CustomHeader;