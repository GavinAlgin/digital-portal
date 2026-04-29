# import asyncio
# import websockets
# import json
# import psutil
# import platform
# import socket
# import time
# import uuid
# from datetime import datetime
# import os
# import logging

# SERVER_URL = "ws://localhost:8000/ws/agent"

# AGENT_FILE = "agent_id.txt"

# logging.basicConfig(
#     filename="agent.log",
#     level=logging.INFO,
#     format="%(asctime)s [%(levelname)s] %(message)s"
# )

# def get_agent_id():
#     if os.path.exists(AGENT_FILE):
#         return open(AGENT_FILE).read().strip()
#     new_id = str(uuid.uuid4())
#     with open(AGENT_FILE, "w") as f:
#         f.write(new_id)
#     return new_id

# AGENT_ID = get_agent_id()
# HOSTNAME = socket.gethostname()

# def get_system_data():
#     ram = psutil.virtual_memory()
#     disk = psutil.disk_usage('/')

#     return {
#         "agent_id": AGENT_ID,
#         "hostname": HOSTNAME,
#         "os": platform.system(),
#         "last_seen": datetime.utcnow().isoformat(),
#         "metrics": {
#             "ram": ram.percent,
#             "cpu": psutil.cpu_percent(),
#             "disk": round(disk.free / (1024**3))
#         }
#     }

# def execute_command(cmd):
#     logging.info(f"Executing: {cmd}")

#     try:
#         if cmd == "ping":
#             return {"status": "ok"}

#         elif cmd == "shutdown":
#             os.system("shutdown /s /t 1")
#             return {"status": "shutdown_triggered"}

#         elif cmd == "restart":
#             os.system("shutdown /r /t 1")
#             return {"status": "restart_triggered"}

#         return {"status": "unknown_command"}

#     except Exception as e:
#         return {"status": "error", "message": str(e)}

# async def run():
#     url = f"{SERVER_URL}/{AGENT_ID}"

#     while True:
#         try:
#             async with websockets.connect(url) as ws:
#                 logging.info("CONNECTED")

#                 while True:
#                     # send telemetry
#                     await ws.send(json.dumps({
#                         "type": "telemetry",
#                         "data": get_system_data()
#                     }))

#                     try:
#                         msg = await asyncio.wait_for(ws.recv(), timeout=2)
#                         data = json.loads(msg)

#                         if data.get("type") == "command":
#                             result = execute_command(data.get("command"))

#                             await ws.send(json.dumps({
#                                 "type": "command_ack",
#                                 "agent_id": AGENT_ID,
#                                 "command": data.get("command"),
#                                 "result": result
#                             }))

#                     except asyncio.TimeoutError:
#                         pass

#                     await asyncio.sleep(5)

#         except Exception as e:
#             logging.error(f"Reconnect error: {e}")
#             time.sleep(3)

# asyncio.run(run())
import asyncio
import websockets
import json
import psutil
import platform
import socket
import uuid
from datetime import datetime
import os
import logging

# ---------------- CONFIG ----------------
AGENT_ID = str(uuid.uuid4())
HOSTNAME = socket.gethostname()

SERVER_URL = f"ws://localhost:8000/ws/agent/{AGENT_ID}"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# ---------------- SYSTEM DATA ----------------
def get_system_data():
    ram = psutil.virtual_memory()

    try:
        disk = psutil.disk_usage('C:\\')  # Windows-safe
    except:
        disk = psutil.disk_usage('/')

    return {
        "agent_id": AGENT_ID,
        "hostname": HOSTNAME,
        "os": platform.system(),
        "last_seen": datetime.utcnow().isoformat(),
        "metrics": {
            "ram": ram.percent,
            "cpu": psutil.cpu_percent(interval=1),
            "disk": round(disk.free / (1024**3))
        }
    }

# ---------------- COMMAND EXECUTION ----------------
def execute_command(cmd):
    logging.info(f"[COMMAND] {cmd}")

    try:
        if cmd == "ping":
            return {"status": "ok"}

        elif cmd == "shutdown":
            os.system("shutdown /s /t 1")
            return {"status": "shutdown_triggered"}

        elif cmd == "restart":
            os.system("shutdown /r /t 1")
            return {"status": "restart_triggered"}

        return {"status": "unknown_command"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

# ---------------- MAIN LOOP ----------------
async def run():
    print(f"[AGENT STARTED] ID={AGENT_ID}")
    print(f"[CONNECTING] {SERVER_URL}")

    while True:
        try:
            async with websockets.connect(
                SERVER_URL,
                ping_interval=20,
                ping_timeout=20
            ) as ws:

                print("[CONNECTED ✅]")

                while True:
                    msg = await ws.recv()
                    data = json.loads(msg)

                    print("[RECEIVED]", data)

                    # -----------------------------
                    # ONLY SEND DATA ON REQUEST
                    # -----------------------------
                    if data.get("type") == "refresh_request":
                        payload = {
                            "type": "telemetry",
                            "data": get_system_data()
                        }

                        await ws.send(json.dumps(payload))
                        print("[SENT TELEMETRY ON DEMAND]")

                    # -----------------------------
                    # COMMANDS
                    # -----------------------------
                    if data.get("type") == "command":
                        result = execute_command(data.get("command"))

                        await ws.send(json.dumps({
                            "type": "command_ack",
                            "agent_id": AGENT_ID,
                            "command": data.get("command"),
                            "result": result
                        }))

        except Exception as e:
            print(f"[ERROR ❌] {repr(e)}")
            await asyncio.sleep(3)

# ---------------- ENTRY ----------------
if __name__ == "__main__":
    asyncio.run(run())