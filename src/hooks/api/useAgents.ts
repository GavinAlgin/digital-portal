import { useEffect, useState } from "react";
import { fetchAgents } from ".";

export const useAgents = () => {
  const [agents, setAgents] = useState([]);

  const load = async () => {
    const data = await fetchAgents();
    setAgents(Object.values(data));
  };

  useEffect(() => {
    load();

    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return { agents, refresh: load };
};