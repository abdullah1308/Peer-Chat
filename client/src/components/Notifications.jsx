import React, { useContext } from "react";
import { Typography, IconButton, Stack, Tooltip, Avatar,  } from "@mui/material";
import {Call, CallEnd} from '@mui/icons-material';
import { SocketContext } from "../SocketContext";
import Sound from '@studysync/react-sound';
import CallSound from "../sounds/call.mp3"

const styles = {
  icon: {
    color: "#fff",
    fontSize: 20,
  }
}
const Notifications = () => {
    const { answerCall, declineCall, call, callAccepted } = useContext(SocketContext);
    return (
      <>
        {call.isReceivingCall && !callAccepted && (
          <>
            <Sound
              url={CallSound}
              playStatus={Sound.status.PLAYING}
              loop={true}
            />
            <Typography variant="h6" align='center' style={{width: "100%"}}>
              {call.name || "Unknown"} is calling
            </Typography>


            <div style={{display: "flex", justifyContent: "center", margin: "8px"}}>
              <Stack direction="row" spacing={2}>
                  <Tooltip title="Answer call">
                    <Avatar style={{backgroundColor: "#66CD00"}}>
                        <IconButton aria-label="answer call" onClick={answerCall}>   
                            <Call sx={styles.icon}/>
                        </IconButton>
                    </Avatar>
                  </Tooltip>

                  <Tooltip title="Decline call">
                    <Avatar style={{backgroundColor: "#D22B2B"}}>
                        <IconButton aria-label="decline call" onClick={declineCall}>
                            <CallEnd sx={styles.icon}/>
                        </IconButton>
                    </Avatar>
                  </Tooltip>
              </Stack>
            </div>
          </>
        )}
      </>
    )
};

export default Notifications;