"""
WSGI config for messenger_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from socketio_app.views import sio
import socketio
import eventlet
import eventlet.wsgi

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "messenger_backend.settings")

application = get_wsgi_application()

application = socketio.WSGIApp(sio, application)

eventlet.wsgi.server(eventlet.listen(("", 8000)), application, log_output=False)
