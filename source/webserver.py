# Python 3 server
from http.server import BaseHTTPRequestHandler, HTTPServer
import sys


path_lookup = {
    "/": "page/index.html",
    "/favicon.ico": "page/resources/favicon.ico",
    "/index.css": "page/index.css",
    "/graph.html": "page/graph.html",
}


type_lookup = {
    "/" : "text/html",
    "/favicon.ico" : "image/x-icon",
    "/index.css": "text/css",
    "/graph.html": "text/html",
    
}


class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        local_file = (path_lookup[self.path], type_lookup[self.path])
        
        try:
            content_bytes = open(local_file[0], "rb")
            content_type = local_file[1]
            data = content_bytes.read()
            content_bytes.close()
            self.send_response(200)
            self.send_header("Content-type", content_type)
            self.end_headers()
            self.wfile.write(data)

        except (KeyError, FileNotFoundError):
            print(f"failed {e}: {self.path}")
            self.send_response(400)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(data)


if __name__ == "__main__":
    if len(sys.argv) == 2:
        hostName = sys.argv[1]
        serverPort = 80
    elif len(sys.argv) == 3:
        hostName = sys.argv[1]
        serverPort = int(sys.argv[2])
    else:
        hostName = "localhost"
        serverPort = 80

    webServer = HTTPServer((hostName, serverPort), MyServer)
    print(f'Server started http://{hostName}:{serverPort}')

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        print("Keyboard stop")
        pass

    webServer.server_close()
    print("Server stopped.")