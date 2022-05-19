# Python 3 server
from http.server import BaseHTTPRequestHandler, HTTPServer
import sys


path_lookup = {
    "/": "page/index.html",
    "/description.css": "page/description.css",
    "/envelope.js": "page/envelope.js",
    "/envelopeGraph.js": "page/envelopeGraph.js",
    "/favicon.ico": "page/favicon.ico",
    "/frequencies.js": "page/frequencies.js",
    "/graph.js": "page/graph.js",
    "/index.css": "page/index.css",
    "/index.js": "page/index.js",
    "/info.html": "page/info.html",
    "/midiKeyboard.js": "page/midiKeyboard.js",
    "/parse.js": "page/parse.js",
    "/piano.js": "page/piano.js",
    "/pianoroll.js": "page/pianoroll.js",
    "/record.js": "page/record.js",
    "/synth.js": "page/synth.js",
    "/url.js": "page/url.js",
    "/waveform.js": "page/waveform.js",
}


type_lookup = {
    "/" : "text/html",
    "/description.css": "text/css",
    "/envelope.js": "text/jscript",
    "/envelopeGraph.js": "text/jscript",
    "/favicon.ico" : "image/x-icon",
    "/frequencies.js": "text/jscript",
    "/graph.js": "text/jscript",
    "/index.css": "text/css",
    "/index.js": "text/jscript",
    "/index.html": "text/html",
    "/info.html": "text/html",
    "/midiKeyboard.js": "text/jscript",
    "/parse.js": "text/jscript",
    "/piano.js": "text/jscript",
    "/pianoroll.js": "text/jscript",
    "/record.js": "text/jscript",
    "/synth.js": "text/jscript",
    "/url.js": "text/jscript",
    "/waveform.js": "text/jscript",
}


class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?")[0]
        local_file = (path_lookup[path], type_lookup[path])
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

    try:
        webServer = HTTPServer((hostName, serverPort), MyServer)
        print(f'Server started http://{hostName}:{serverPort}')
        webServer.serve_forever()
    except PermissionError:
        print(f"PermissionError: Not allowed to host server on: {hostName}:{serverPort}")
        print(f"Consider changing to a different hostname or port with:")
        print(f"\tpython webserver.py *Hostname* *port*")
        quit()
    except KeyboardInterrupt:
        print("Keyboard stop")
        pass

    webServer.server_close()
    print("Server stopped.")
