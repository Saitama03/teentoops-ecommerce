#!/usr/bin/env python3
"""
Flask wrapper for Django TeenTops e-commerce backend
This allows deployment of the Django app through Flask deployment system
"""

import os
import sys
import django
from django.core.wsgi import get_wsgi_application
from flask import Flask, request, Response
from werkzeug.serving import WSGIRequestHandler

# Add the project directory to Python path
project_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_dir)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'teentops_backend.settings')

# Setup Django
django.setup()

# Get Django WSGI application
django_app = get_wsgi_application()

# Create Flask app as a wrapper
app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
def proxy_to_django(path):
    """Proxy all requests to Django application"""
    
    # Create a WSGI environ dict from Flask request
    environ = request.environ.copy()
    environ['PATH_INFO'] = '/' + path if path else '/'
    environ['REQUEST_METHOD'] = request.method
    environ['CONTENT_TYPE'] = request.content_type or ''
    environ['CONTENT_LENGTH'] = str(len(request.get_data()))
    
    # Handle request body
    if request.get_data():
        from io import BytesIO
        environ['wsgi.input'] = BytesIO(request.get_data())
    
    # Collect response data
    response_data = []
    response_status = [None]
    response_headers = [None]
    
    def start_response(status, headers, exc_info=None):
        response_status[0] = status
        response_headers[0] = headers
        return response_data.append
    
    # Call Django WSGI app
    app_iter = django_app(environ, start_response)
    
    try:
        for data in app_iter:
            response_data.append(data)
    finally:
        if hasattr(app_iter, 'close'):
            app_iter.close()
    
    # Create Flask response
    response_body = b''.join(response_data)
    status_code = int(response_status[0].split(' ', 1)[0])
    
    # Convert headers to Flask format
    headers = {}
    for header_name, header_value in response_headers[0]:
        headers[header_name] = header_value
    
    return Response(response_body, status=status_code, headers=headers)

if __name__ == '__main__':
    # Enable CORS for all routes
    from flask_cors import CORS
    try:
        CORS(app, origins=['*'])
    except ImportError:
        # CORS not available, continue without it
        pass
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=False)
