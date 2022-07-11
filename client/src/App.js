import React from "react";

import VideoPlayer from "./components/VideoPlayer";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import MyAppBar from "./components/MyAppBar";
import ControlBar from "./components/ControlBar";

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#202124",
    },
};

const App = () => {
    return (
        <div style={styles.wrapper}>
            <MyAppBar />
            <VideoPlayer>
                <Options>
                    <Notifications />
                </Options>
            </VideoPlayer>
            <ControlBar /> 
        </div>
    );
};

export default App;
