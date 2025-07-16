import { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function useRealtime(callback) {
  useEffect(() => {
    const accountID = localStorage.getItem("accountId");
    const WS_URL = "http://localhost:8080/ws"; 
    const socket = new SockJS(WS_URL);
    const stomp = Stomp.over(socket);

    const onConnected = () => {
      console.log("WebSocket connected");

      stomp.subscribe(`/topic/chat/${accountID}`, (message) => {
        callback && callback(message);
      });

      stomp.subscribe(`/topic/interaction`, (message) => {
        callback && callback(message);
      });

      stomp.subscribe(`/topic/notification/${accountID}`, (message) => {
        callback && callback(message);
      });
    };

    stomp.connect({}, onConnected, (error) => {
      console.error("WebSocket connect error:", error);
    });

    return () => {
      if (stomp.connected) {
        stomp.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    };
  }, [callback]);

  return null; // Không render gì cả
}

export default useRealtime;
