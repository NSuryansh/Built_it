# start.py

# Fix for Python 3.11+ breaking deprecated getargspec
import inspect
if not hasattr(inspect, 'getargspec'):
    inspect.getargspec = inspect.getfullargspec

# Import your app only AFTER the patch
from run import app

# Use gunicorn to run the app if executing this file directly
if __name__ == "__main__":
    import os
    from gunicorn.app.wsgiapp import run
    run()
