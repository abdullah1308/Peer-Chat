import React, { useContext } from "react";
import { Grid, Typography } from "@mui/material";
import { SocketContext } from "../SocketContext";
import "./VideoPlayer.css";

const styles = {
    gridContainer: {
        justifyContent: "center",
        padding: "16px",
    },
    gridItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
};

const VideoPlayer = (props) => {
    const {
        name,
        stream,
        call,
        callAccepted,
        userVideo,
        myVideo,
        screenSharing,
    } = useContext(SocketContext);

    const fullScreen = (e) => {
        if (e.target.requestFullscreen) {
            e.target.requestFullscreen();
        } else if (e.target.msRequestFullscreen) {
            e.target.msRequestFullscreen();
        } else if (e.target.mozRequestFullScreen) {
            e.target.mozRequestFullScreen();
        } else if (e.target.webkitRequestFullscreen) {
            e.target.webkitRequestFullscreen();
        }
    };

    return (
        <Grid container sx={styles.gridContainer} spacing={2}>
            {/* user video */}
            {stream && (
                <Grid item xs={12} lg={6} sx={styles.gridItem}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        align="left"
                        width="100%"
                        color="#fff"
                    >
                        {name || "\u00a0"}
                    </Typography>
                    <video
                        playsInline
                        autoPlay
                        muted
                        disablePictureInPicture
                        ref={myVideo}
                        onClick={fullScreen}
                        style={
                            screenSharing
                                ? { width: "100%", borderRadius: "8px" }
                                : {
                                      width: "100%",
                                      borderRadius: "8px",
                                      transform: "rotateY(180deg)",
                                  }
                        }
                    />
                </Grid>
            )}

            {/* call video & options */}
            {callAccepted ? (
                <>
                    <Grid item xs={12} lg={6} sx={styles.gridItem}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            align="left"
                            width="100%"
                            color="#fff"
                        >
                            {call.name || "\u00a0"}
                        </Typography>
                        <video
                            playsInline
                            autoPlay
                            ref={userVideo}
                            onClick={fullScreen}
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    </Grid>
                </>
            ) : (
                <Grid item sx={styles.gridItem} xs={12} lg={4}>
                    {props.children}
                </Grid>
            )}
        </Grid>
    );
};

export default VideoPlayer;
