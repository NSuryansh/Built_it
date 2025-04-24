import inspect
if not hasattr(inspect, 'getargspec'):
    inspect.getargspec = inspect.getfullargspec

from run import app

if __name__ == "__main__":
    import os
    from gunicorn.app.wsgiapp import run
    run()
