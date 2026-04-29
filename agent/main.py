# from fastapi import FastAPI, WebSocket
# import json

# app = FastAPI()

# active_agents = {}

# @app.get("/")
# def root():
#     return {
#         "status": "running",
#         "service": "intune-lite-backend"
#     }
    
# @app.websocket("/ws/agent/{agent_id}")
# async def agent_ws(websocket: WebSocket, agent_id: str):
#     await websocket.accept()
#     active_agents[agent_id] = websocket

#     try:
#         while True:
#             data = await websocket.receive_text()
#             print("Agent:", agent_id, data)

#     except:
#         active_agents.pop(agent_id, None)

# @app.get("/api/agents")
# def get_agents():
#     return {
#         "active_agents": list(active_agents.keys())
#     }
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from typing import Dict
# import json

# app = FastAPI()

# active_agents: Dict[str, WebSocket] = {}
# agent_data = {}  # store latest telemetry


# @app.get("/")
# def root():
#     return {
#         "status": "running",
#         "service": "intune-lite-backend"
#     }


# # -------------------------
# # WebSocket: Agent Channel
# # -------------------------
# @app.websocket("/ws/agent/{agent_id}")
# async def agent_ws(websocket: WebSocket, agent_id: str):
#     await websocket.accept()
#     active_agents[agent_id] = websocket

#     try:
#         while True:
#             raw = await websocket.receive_text()
#             data = json.loads(raw)

#             # store latest telemetry
#             if data.get("type") == "telemetry":
#                 agent_data[agent_id] = data["data"]
#                 print(f"[TELEMETRY] {agent_id}", data["data"])

#             # handle command response
#             elif data.get("type") == "command_ack":
#                 print(f"[COMMAND ACK] {agent_id}", data)

#     except WebSocketDisconnect:
#         print(f"[DISCONNECT] {agent_id}")
#         active_agents.pop(agent_id, None)
#         agent_data.pop(agent_id, None)


# # -------------------------
# # API: Get agents (FIXED)
# # -------------------------
# @app.get("/api/agents")
# def get_agents():
#     return [
#         {
#             "agent_id": aid,
#             **agent_data.get(aid, {})
#         }
#         for aid in active_agents.keys()
#     ]


# # -------------------------
# # API: Send command to agent (MISSING BEFORE)
# # -------------------------
# @app.post("/api/command")
# async def send_command(payload: dict):
#     agent_id = payload.get("agent_id")
#     command = payload.get("command")

#     ws = active_agents.get(agent_id)

#     if not ws:
#         return {"status": "offline"}

#     await ws.send_text(json.dumps({
#         "type": "command",
#         "command": command
#     }))

#     return {"status": "sent"}
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

app = FastAPI()

active_agents: Dict[str, WebSocket] = {}
agent_data = {}
frontend_connections: List[WebSocket] = []


# -------------------------
# Root
# -------------------------
@app.get("/")
def root():
    return {
        "status": "running",
        "service": "intune-lite-backend"
    }


# -------------------------
# Agents WebSocket
# -------------------------
@app.websocket("/ws/agent/{agent_id}")
async def agent_ws(websocket: WebSocket, agent_id: str):
    await websocket.accept()
    active_agents[agent_id] = websocket

    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)

            if data.get("type") == "telemetry":
                agent_data[agent_id] = data["data"]
                print(f"[TELEMETRY] {agent_id}")

                # broadcast to UI
                await broadcast()

            elif data.get("type") == "command_ack":
                print(f"[COMMAND ACK] {agent_id}", data)

    except WebSocketDisconnect:
        active_agents.pop(agent_id, None)
        agent_data.pop(agent_id, None)
        await broadcast()


# -------------------------
# Frontend WebSocket
# -------------------------
@app.websocket("/ws/dashboard")
async def dashboard_ws(websocket: WebSocket):
    await websocket.accept()
    frontend_connections.append(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        frontend_connections.remove(websocket)


# -------------------------
# API: Agents
# -------------------------
@app.get("/api/agents")
def get_agents():
    return [
        {
            "agent_id": aid,
            **agent_data.get(aid, {})
        }
        for aid in active_agents.keys()
    ]


# -------------------------
# API: Commands
# -------------------------
@app.post("/api/command")
async def send_command(payload: dict):
    agent_id = payload.get("agent_id")
    command = payload.get("command")

    ws = active_agents.get(agent_id)

    if not ws:
        return {"status": "offline"}

    await ws.send_text(json.dumps({
        "type": "command",
        "command": command
    }))

    return {"status": "sent"}


# -------------------------
# Broadcast to UI
# -------------------------
async def broadcast():
    payload = [
        {
            "agent_id": aid,
            **agent_data.get(aid, {})
        }
        for aid in active_agents.keys()
    ]

    dead = []

    for ws in frontend_connections:
        try:
            await ws.send_json(payload)
        except:
            dead.append(ws)

    for d in dead:
        frontend_connections.remove(d)

@app.post("/api/refresh/{agent_id}")
async def refresh_agent(agent_id: str):
    ws = active_agents.get(agent_id)

    if not ws:
        return {"status": "offline"}

    await ws.send_text(json.dumps({
        "type": "refresh_request"
    }))

    return {"status": "requested"}