const BASE_URL = "http://localhost:8000";

export const fetchAgents = async () => {
  const res = await fetch(`${BASE_URL}/api/agents`);
  return res.json();
};

export const sendCommand = async (agentId: string, command: string) => {
  const res = await fetch(`${BASE_URL}/api/command`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      agent_id: agentId,
      command
    })
  });

  return res.json();
};