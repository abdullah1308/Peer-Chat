# Peer-Chat
A P2P video chat application based on WebRTC built using React and Node using the simple-peer and Socket.io packages. Live demo of the project can be found [here](https://peer-chat.netlify.app).

## Setup Instructions

 1. Download or clone the repository and run `npm i` to install the necessary packages
 2. Open the *client* directory in the terminal and run `npm start` to start the front-end
 3. Open the *server* directory in the terminal and run `node index.js` to start the back-end
 4. The application will be visible on http://localhost:3000

## Usage

 1. To start a call locally, open the application on two separate tabs
 2. Give permission to the application to access microphone and camera.
 3. Click on the **COPY YOUR ID** button on one of the tabs and paste it in the **ID to Call** input in the other tab and click on the *Call* button.

![image](https://user-images.githubusercontent.com/76054921/178292767-488d238c-9523-4b09-9c41-06f8828104f9.png)

 4. After a few seconds a ringtone will be audible on the tab whose ID was pasted in the **ID to Call** input and buttons to answer and decline the call will be visible.
 
 ![image](https://user-images.githubusercontent.com/76054921/178292267-9c908a1e-f7b2-43a0-bb5e-3fba26ee0f9b.png)
