import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:8000/ws/dashboard";

export const useDashboardSocket = () => {
  const [agents, setAgents] = useState([]);
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const maxRetry = 10;

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Dashboard connected");
        retryRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // -----------------------------
          // SAFE UPDATE (NO FULL RESET)
          // -----------------------------
          setAgents((prev) => {
            const map = new Map();

            prev.forEach((a) => map.set(a.agent_id, a));

            data.forEach((newAgent) => {
              map.set(newAgent.agent_id, newAgent);
            });

            return Array.from(map.values());
          });

        } catch (err) {
          console.error("WS parse error", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
      };

      ws.onclose = () => {
        console.warn("WS disconnected");

        if (!isMounted) return;

        if (retryRef.current < maxRetry) {
          retryRef.current += 1;

          setTimeout(() => {
            console.log("Reconnecting...", retryRef.current);
            connect();
          }, 2000);
        } else {
          console.error("Max reconnect attempts reached");
        }
      };
    };

    connect();

    return () => {
      isMounted = false;
      wsRef.current?.close();
    };
  }, []);

  return { agents };
};