import React, { useState, useContext } from "react";
import { Paper, Stack, IconButton, Tooltip, Avatar } from "@mui/material";
import {
    Mic,
    MicOff,
    Videocam,
    VideocamOff,
    CallEnd,
    PresentToAllRounded,
    Chat,
    ChatBubble,
} from "@mui/icons-material";
import { SocketContext } from "../SocketContext";
import Messenger from "./Messenger";
import Alert from "./Alert";

const styles = {
    container: {
        height: "5rem",
        width: "100vw",
        backgroundColor: "#1F2833",
        marginTop: "auto",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        color: "#fff",
        fontSize: 20,
    },
    iconContainerOn: {
        backgroundColor: "#3C4043",
    },
    iconContainerOff: {
        backgroundColor: "#EA4335",
    },
};
const ControlBar = ({ children }) => {
    const {
        screenSharing,
        shareScreen,
        stream,
        setStream,
        callAccepted,
        leaveCall,
        isMessenger,
        setIsMessenger,
        messageAlert,
    } = useContext(SocketContext);

    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);

    const toggleCamera = () => {
        const videoTrack = stream
            .getTracks()
            .find((track) => track.kind === "video");
        if (videoTrack.enabled) {
            videoTrack.enabled = false;
            setStream(stream);
            setCameraOn(false);
        } else {
            videoTrack.enabled = true;
            setStream(stream);
            setCameraOn(true);
        }
    };

    const toggleMic = () => {
        const audioTrack = stream
            .getTracks()
            .find((track) => track.kind === "audio");
        if (audioTrack.enabled) {
            audioTrack.enabled = false;
            setStream(stream);
            setMicOn(false);
        } else {
            audioTrack.enabled = true;
            setStream(stream);
            setMicOn(true);
        }
    };

    const toggleChat = () => {
        setIsMessenger((prevIsMessenger) => !prevIsMessenger);
    };

    return (
        <>
            <Paper elevation={10} square style={styles.container}>
                <Stack direction="row" spacing={2}>
                    <Tooltip
                        title={
                            micOn ? "Turn off microphone" : "Turn on microphone"
                        }
                    >
                        <Avatar
                            style={
                                micOn
                                    ? styles.iconContainerOn
                                    : styles.iconContainerOff
                            }
                        >
                            <IconButton
                                aria-label={
                                    micOn ? "turn off mic" : "turn on mic"
                                }
                                onClick={() => toggleMic()}
                            >
                                {micOn ? (
                                    <Mic sx={styles.icon} />
                                ) : (
                                    <MicOff sx={styles.icon} />
                                )}
                            </IconButton>
                        </Avatar>
                    </Tooltip>

                    <Tooltip
                        title={cameraOn ? "Turn off camera" : "Turn on camera"}
                    >
                        <Avatar
                            style={
                                cameraOn
                                    ? styles.iconContainerOn
                                    : styles.iconContainerOff
                            }
                        >
                            <IconButton
                                aria-label={
                                    cameraOn
                                        ? "turn off camera"
                                        : "turn on camera"
                                }
                                onClick={() => toggleCamera()}
                            >
                                {cameraOn ? (
                                    <Videocam sx={styles.icon} />
                                ) : (
                                    <VideocamOff sx={styles.icon} />
                                )}
                            </IconButton>
                        </Avatar>
                    </Tooltip>

                    {callAccepted && (
                        <>
                            <Tooltip
                                title={
                                    !screenSharing
                                        ? "Present Now"
                                        : "Stop Presenting"
                                }
                            >
                                <Avatar
                                    style={
                                        !screenSharing
                                            ? styles.iconContainerOn
                                            : { backgroundColor: "#8AB4F8" }
                                    }
                                >
                                    <IconButton
                                        aria-label={
                                            !screenSharing
                                                ? "present now"
                                                : "stop presenting"
                                        }
                                        onClick={() => shareScreen()}
                                    >
                                        <PresentToAllRounded
                                            sx={
                                                !screenSharing
                                                    ? {
                                                          fontSize: 25,
                                                          color: "#fff",
                                                      }
                                                    : {
                                                          fontSize: 25,
                                                          color: "#000",
                                                      }
                                            }
                                        />
                                    </IconButton>
                                </Avatar>
                            </Tooltip>

                            <Tooltip
                                title={
                                    !isMessenger ? "Open Chat" : "Close Chat"
                                }
                            >
                                <Avatar
                                    style={
                                        !isMessenger
                                            ? styles.iconContainerOn
                                            : styles.iconContainerOff
                                    }
                                >
                                    <IconButton
                                        aria-label={
                                            !isMessenger
                                                ? "open chat"
                                                : "close chat"
                                        }
                                        onClick={() => toggleChat()}
                                    >
                                        {!isMessenger ? (
                                            <Chat sx={styles.icon} />
                                        ) : (
                                            <ChatBubble sx={styles.icon} />
                                        )}
                                    </IconButton>
                                </Avatar>
                            </Tooltip>

                            <Tooltip title="End call">
                                <Avatar
                                    style={{
                                        backgroundColor: "#EA4335",
                                        borderRadius: "20px",
                                        width: "55px",
                                    }}
                                >
                                    <IconButton
                                        aria-label="leave call"
                                        size="large"
                                        onClick={leaveCall}
                                    >
                                        <CallEnd
                                            sx={{ fontSize: 25, color: "#fff" }}
                                        />
                                    </IconButton>
                                </Avatar>
                            </Tooltip>
                        </>
                    )}
                </Stack>
            </Paper>
            {isMessenger ? <Messenger /> : messageAlert.isPopup && <Alert />}
        </>
    );
};

export default ControlBar;
