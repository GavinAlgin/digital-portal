from fastapi import FastAPI, WebSocket
import json

app = FastAPI()

active_agents = {}

@app.get("/")
def root():
    return {
        "status": "running",
        "service": "intune-lite-backend"
    }
    
@app.websocket("/ws/agent/{agent_id}")
async def agent_ws(websocket: WebSocket, agent_id: str):
    await websocket.accept()
    active_agents[agent_id] = websocket

    try:
        while True:
            data = await websocket.receive_text()
            print("Agent:", agent_id, data)

    except:
        active_agents.pop(agent_id, None)