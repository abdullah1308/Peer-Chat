import React, { useContext } from "react";
import { SocketContext } from "../SocketContext";
import { ChatBubble } from '@mui/icons-material';
import { Typography } from "@mui/material";
import MessageSound from "../sounds/msg.mp3";
import Sound from '@studysync/react-sound';
import "./Alert.scss";

const Alert = () => {
    const { messageAlert } = useContext(SocketContext);
    return (
        <>
            <Sound
                url={MessageSound}
                playStatus={Sound.status.PLAYING}
            />

            <div className="message-alert-popup">
                <div className="alert-header">
                    <ChatBubble className="icon"/>
                    <Typography className="from">
                        {messageAlert.payload.user}
                    </Typography>
                </div>
                <Typography className="alert-msg">
                    {messageAlert.payload.msg}
                </Typography>
            </div>
        </>
    );
};

export default Alert;
