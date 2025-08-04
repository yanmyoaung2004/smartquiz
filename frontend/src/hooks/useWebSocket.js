import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";

const useWebSocket = (token, onInvite, onDelete) => {
  const baseURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (!token) return;
    const socket = new SockJS(`${baseURL}/ws-notifications?token=${token}`);

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to the server");
        client.subscribe("/user/queue/invitations", (message) => {
          const body = JSON.parse(message.body);
          if (body.status === "INVITE") {
            if (onInvite) onInvite(body.notification);
          } else if (body.status === "DELETE") {
            // eslint-disable-next-line no-unused-vars
            const { status, ...rest } = body;
            if (onDelete) onDelete(rest);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [baseURL, onDelete, onInvite, token]);

  return null;
};

export default useWebSocket;
