import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8080/ws-chat"; 

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ WebSocket connected");

      const currentUserId = localStorage.getItem("userId"); 
      if (!currentUserId) {
        console.warn("No userId found to subscribe!");
        return;
      }

      stompClient.subscribe(`/topic/messages/${currentUserId}`, (message) => {
        const msgBody = JSON.parse(message.body);
        onMessageReceived(msgBody);
      });
    },
    onStompError: (frame) => {
      console.error("STOMP Error", frame);
    },
  });

  stompClient.activate();
};

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });
  } else {
    console.error("STOMP client is not connected.");
  }
};
