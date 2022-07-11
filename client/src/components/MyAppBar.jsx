import React, { useEffect, useState } from "react";
import { AppBar, Typography, Toolbar } from "@mui/material";

const MyAppBar = () => {
    const [clockState, setClockState] = useState();

    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            setClockState(
                date.toLocaleTimeString(navigator.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                })
            );
        }, 1000);
    }, []);

    return (
        <AppBar position="static" sx={{background: "#1F2833"}}>
            <Toolbar>
                <Typography variant="h6" sx={{ color: "white", flexGrow: 1 }}>
                    Peer Chat
                </Typography>
                <Typography variant="h6" sx={{ color: "white" }}>
                    {clockState}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;
