import os
import time
import subprocess
import fwatch

watched_dir = "./"

def run_function():
    print("File change detected. Running your command...")
    fwatch.run()
    pass

def get_latest_modification_time(watched_dir):
    return max(os.path.getmtime(os.path.join(watched_dir, filename)) for filename in os.listdir(watched_dir))

def monitor_directory(watched_dir):
    last_change_time = get_latest_modification_time(watched_dir)
    
    while True:
        try:
            time.sleep(5)  # sleep for 5 seconds
            new_last_change_time = get_latest_modification_time(watched_dir)
            if new_last_change_time > last_change_time:
                run_function()
                last_change_time = new_last_change_time
        except KeyboardInterrupt:
            print("Stopped by User")
            break

if __name__ == "__main__":
    monitor_directory(watched_dir)
    