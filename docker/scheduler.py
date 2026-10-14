"""Run daily transition caching at 03:51 JST, with restart catch-up."""
from datetime import datetime
import os
from pathlib import Path
import signal
import subprocess
import time

stopped = False


def stop(*_):
    global stopped
    stopped = True


for signum in (signal.SIGTERM, signal.SIGINT):
    signal.signal(signum, stop)
state = Path('/var/www/unyohub/libs_data/transition-cache-date')
print('Transition cache scheduler: daily at 03:51 Asia/Tokyo', flush=True)
while not stopped:
    now = datetime.now()
    today = now.date().isoformat()
    if (now.hour, now.minute) >= (3, 51) and (not state.exists() or state.read_text() != today):
        process = subprocess.Popen(['unyohub', 'cache-transitions'])
        while process.poll() is None and not stopped:
            time.sleep(0.5)
        if stopped:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
            break
        if process.returncode == 0:
            temporary = state.with_suffix('.tmp')
            temporary.write_text(today)
            os.replace(temporary, state)
            print('Transition cache completed:', today, flush=True)
        else:
            print('Transition cache failed; retrying in 30 seconds', flush=True)
    for _ in range(30):
        if stopped:
            break
        time.sleep(1)
