import React, {
    createContext,
    useState,
    useRef,
    useEffect,
    useCallback,
    useReducer,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import MessageListReducer from "./reducers/MessageListReducer";
const SocketContext = createContext();

const socket = io("http://localhost:5000");
const initialMsgState = [];

const ContextProvider = ({ children }) => {
    const [me, setMe] = useState("");
    const [name, setName] = useState("");
    const [stream, setStream] = useState();
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [screenSharing, setScreenSharing] = useState(false);
    const [isMessenger, setIsMessenger] = useState(false);
    const [messageAlert, setMessageAlert] = useState({});

    const [messageList, messageListReducer] = useReducer(
        MessageListReducer,
        initialMsgState
    );

    const myVideo = useCallback(
        (node) => {
            if (node !== null) {
                node.srcObject = stream;
            }
        },
        [stream]
    );
    const streamRef = useRef();
    const trackRef = useRef([]);
    const connectionRef = useRef();
    const userVideo = useRef();
    const alertTimeoutRef = useRef();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: { aspectRatio: 1.777777778 }, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                streamRef.current = currentStream;
            })
            .catch((err) => {});

        socket.on("me", (id) => setMe(id));
        socket.on("callUser", ({ from, name: callerName, signal }) => {
            setCall({
                isReceivingCall: true,
                from: from,
                name: callerName,
                signal,
            });
        });
    }, []);

    useEffect(() => {
        socket.on("callEnded", (socketId) => {
            if (socketId === call.from) {
                leaveCall();
            }
        });

        socket.on("message", ({ message, from }) => {
            if (from === call.from) {
                clearTimeout(alertTimeoutRef.current);
                messageListReducer({
                    type: "addMessage",
                    payload: {
                        user: call.name ? call.name : "other",
                        msg: message,
                        time: Date.now(),
                    },
                });

                setMessageAlert({
                    isPopup: true,
                    payload: {
                        user: call.name ? call.name : "other",
                        msg: message,
                    },
                });

                alertTimeoutRef.current = setTimeout(() => {
                    setMessageAlert({
                        isPopup: false,
                        payload: {},
                    });
                }, 5000);
            }
        });
    }, [call]);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false });

        streamRef.current.getTracks().forEach((track) => {
            trackRef.current.push(track);
            peer.addTrack(track, streamRef.current);
        });

        peer.on("signal", (data) => {
            socket.emit("answerCall", {
                userToAnswer: call.from,
                signalData: data,
                from: me,
                name,
            });
        });

        peer.on("track", (track, stream) => {
            userVideo.current.srcObject = stream;
        });

        // peer.on('data', (data) => {
        //     clearTimeout(alertTimeout);
        //     messageListReducer({
        //       type: "addMessage",
        //       payload: {
        //         user: (call.name ? call.name : "other"),
        //         msg: data.toString(),
        //         time: Date.now(),
        //       },
        //     });

        //     setMessageAlert({
        //       alert: true,
        //       isPopup: true,
        //       payload: {
        //         user: (call.name ? call.name : "other"),
        //         msg: data.toString(),
        //       },
        //     });

        //     alertTimeout = setTimeout(() => {
        //       setMessageAlert({
        //         ...messageAlert,
        //         isPopup: false,
        //         payload: {},
        //       });
        //     }, 10000);
        // });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const declineCall = () => {
        setCall({});
    };

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: "stun:openrelay.metered.ca:80",
                    },
                    {
                        urls: "turn:openrelay.metered.ca:80",
                        username: "openrelayproject",
                        credential: "openrelayproject",
                    },
                    {
                        urls: "turn:openrelay.metered.ca:443",
                        username: "openrelayproject",
                        credential: "openrelayproject",
                    },
                    {
                        urls: "turn:openrelay.metered.ca:443?transport=tcp",
                        username: "openrelayproject",
                        credential: "openrelayproject",
                    },
                ],
            },
        });

        // Crashes here when no camera permission
        streamRef.current.getTracks().forEach((track) => {
            trackRef.current.push(track);
            peer.addTrack(track, streamRef.current);
        });

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });

        peer.on("track", (track, stream) => {
            userVideo.current.srcObject = stream;
        });

        // peer.on('data', (data) => {
        //     clearTimeout(alertTimeout);
        //     messageListReducer({
        //       type: "addMessage",
        //       payload: {
        //         user: (call.name ? call.name : "other"),
        //         msg: data.toString(),
        //         time: Date.now(),
        //       },
        //     });

        //     setMessageAlert({
        //       alert: true,
        //       isPopup: true,
        //       payload: {
        //         user: (call.name ? call.name : "other"),
        //         msg: data.toString(),
        //       },
        //     });

        //     alertTimeout = setTimeout(() => {
        //       setMessageAlert({
        //         ...messageAlert,
        //         isPopup: false,
        //         payload: {},
        //       });
        //     }, 10000);
        //   });

        socket.on("callAccepted", ({ signal, from, name }) => {
            setCall({ from: from, name: name });
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const shareScreen = () => {
        const stopSharing = () => {
            const videoTrack = trackRef.current.find(
                (track) => track.kind === "video"
            );
            stream.getVideoTracks()[0].stop();
            connectionRef.current.replaceTrack(
                stream.getVideoTracks()[0],
                videoTrack,
                streamRef.current
            );
            setStream(streamRef.current);
            setScreenSharing(false);
        };

        if (screenSharing) {
            stopSharing();
            return;
        }

        navigator.mediaDevices
            .getDisplayMedia({ cursor: true })
            .then((screenStream) => {
                const screenTrack = screenStream.getVideoTracks()[0];
                screenTrack
                    .applyConstraints({ aspectRatio: 1.777777778 })
                    .then(() => {
                        const videoTrack = trackRef.current.find(
                            (track) => track.kind === "video"
                        );
                        connectionRef.current.replaceTrack(
                            videoTrack,
                            screenTrack,
                            streamRef.current
                        );
                        setStream(screenStream);
                        setScreenSharing(true);

                        screenTrack.onended = () => {
                            const videoTrack = trackRef.current.find(
                                (track) => track.kind === "video"
                            );
                            connectionRef.current.replaceTrack(
                                stream.getVideoTracks()[0],
                                videoTrack,
                                streamRef.current
                            );
                            setStream(streamRef.current);
                            setScreenSharing(false);
                        };
                    });
            })
            .catch((err) => {});
    };

    const sendMsg = (msg) => {
        // connectionRef.current.send(msg);
        socket.emit("sendMessage", msg);
        messageListReducer({
            type: "addMessage",
            payload: {
                user: name ? name : "you",
                msg: msg,
                time: Date.now(),
            },
        });
    };

    const leaveCall = () => {
        connectionRef.current.destroy();
        window.location.reload();
    };

    return (
        <SocketContext.Provider
            value={{
                me,
                name,
                setName,
                stream,
                setStream,

                call,
                callUser,
                answerCall,
                declineCall,
                leaveCall,
                callAccepted,
                connectionRef,

                myVideo,
                userVideo,
                shareScreen,
                screenSharing,

                sendMsg,
                messageList,
                messageAlert,
                isMessenger,
                setIsMessenger,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
