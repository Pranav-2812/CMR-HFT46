import {io} from "socket.io-client";
// https://park-me-server-fjj5.onrender.com
const socket = io("http://localhost:5173/");
export default socket;
