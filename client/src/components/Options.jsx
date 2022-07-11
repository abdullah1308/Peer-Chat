import React, { useContext, useState } from "react";
import {
    Button,
    TextField,
    Grid,
    Typography,
    Container,
    Paper,
} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone } from "@mui/icons-material";

import { SocketContext } from "../SocketContext";

const styles = {
    gridContainer: {
        width: "100%",
    },
    container: {
        width: "100%",
        maxWidth: "500px",
        margin: "35px 0",
        padding: 0,
    },
    margin: {
        marginTop: "20px",
    },
    padding: {
        padding: "20px",
    },
    paper: {
        padding: "10px",
        borderRadius: "10px",
    },
};

const Options = ({ children }) => {
    const { me, name, setName, callUser } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState("");

    return (
        <Container disableGutters sx={styles.container}>
            <Paper elevation={10} sx={styles.paper}>
                <form noValidate autoComplete="off">
                    <Grid container sx={styles.gridContainer}>
                        <Grid item xs={12} lg={6} sx={styles.padding}>
                            <Typography variant="h6" gutterBottom>
                                Account Info
                            </Typography>
                            <TextField
                                label="Name"
                                value={name}
                                variant="standard"
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                            />
                            <CopyToClipboard text={me} style={styles.margin}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<Assignment fontSize="large" />}
                                >
                                    Copy Your ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={12} lg={6} sx={styles.padding}>
                            <Typography variant="h6" gutterBottom>
                                Make a call
                            </Typography>
                            <TextField
                                label="ID to Call"
                                value={idToCall}
                                variant="standard"
                                onChange={(e) => setIdToCall(e.target.value)}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Phone fontSize="large" />}
                                fullWidth
                                onClick={() => callUser(idToCall)}
                                style={styles.margin}
                            >
                                Call
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {children}
            </Paper>
        </Container>
    );
};

export default Options;
