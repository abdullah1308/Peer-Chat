import React, { useContext, useState } from "react";
import "./Messenger.scss";
import { SocketContext } from "../SocketContext";
import { Send, Close, ChatBubble } from '@mui/icons-material';
import { IconButton, Typography } from "@mui/material";

const Messenger = () => {
    const {setIsMessenger, sendMsg, messageList} = useContext(SocketContext);
    const [msg, setMsg] = useState("");

    const handleChangeMsg = (e) => {
        setMsg(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && msg.length > 0) {
          sendMsg(msg);
          setMsg("");
        }
    };

    const handleSendMsg = () => {
        if(msg.length > 0) {
            sendMsg(msg);
            setMsg("");
        }
    };

    return (
        <div className="messenger-container">
            <div className="messenger-header">
                <ChatBubble sx={{color:"#296D98"}}/>
                <Typography variant="h5" sx={{margin: 0, fontSize: 20}}>Chat</Typography>
                <IconButton aria-label="close chat" onClick={() => setIsMessenger(false)}>
                    <Close sx={{fontSize: "20px"}}/>
                </IconButton>
            </div>

            <div className="chat-section">
                {messageList.map((item) => (
                    <div key={item.time} className="chat-block">
                    <div className="sender">
                        <Typography variant="subtitle2" >
                            {item.user}
                        </Typography>
                        <Typography variant="caption" sx={{ml: "5px", fontWeight: 300}}>
                            {new Date(item.time).toLocaleTimeString(navigator.language, {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            })}
                        </Typography>
                    </div>
                    <Typography variant="body2" sx={{m: 0, pt: "5px", color: "#555"}}>{item.msg}</Typography>
                </div>
                ))}
            </div>

            <div className="send-msg-section">
                <input placeholder="Send a message" value={msg} onChange={(e) => handleChangeMsg(e)} onKeyDown={(e) => handleKeyDown(e)}/>
                <IconButton aria-label="send message" onClick={handleSendMsg}>
                    <Send sx={{fontSize: "20px", color:"#296D98"}}/>
                </IconButton>
            </div>
        </div>
    );
};

export default Messenger;
