import asyncio
import websockets
import json
import psutil
import platform
import socket
import time
import uuid
from datetime import datetime
import os

AGENT_ID = str(uuid.uuid4())
HOSTNAME = socket.gethostname()

SERVER_URL = f"ws://192.168.0.164:8000/ws/agent/{AGENT_ID}"


def get_system_data():
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    return {
        "agent_id": AGENT_ID,
        "hostname": HOSTNAME,
        "os": platform.system(),
        "status": "online",
        "last_seen": datetime.utcnow().isoformat(),
        "metrics": {
            "ram_used": ram.percent,
            "cpu": psutil.cpu_percent(),
            "disk_free": round(disk.free / (1024**3))
        }
    }


def execute_command(cmd):
    print("CMD:", cmd)

    if cmd == "ping":
        print("OK")

    elif cmd == "shutdown":
        os.system("shutdown /s /t 1")


async def run():
    while True:
        try:
            async with websockets.connect(SERVER_URL) as ws:
                print("CONNECTED")

                while True:
                    await ws.send(json.dumps({
                        "type": "telemetry",
                        "data": get_system_data()
                    }))

                    try:
                        msg = await asyncio.wait_for(ws.recv(), timeout=2)
                        data = json.loads(msg)

                        if data.get("type") == "command":
                            execute_command(data.get("command"))

                    except:
                        pass

                    await asyncio.sleep(5)

        except Exception as e:
            print("Reconnect:", e)
            time.sleep(3)


asyncio.run(run())