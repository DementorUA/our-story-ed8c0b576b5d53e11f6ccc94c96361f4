#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PagesLikeHandler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code == 404 and Path("404.html").is_file():
            body = Path("404.html").read_bytes()
            self.send_response(404, "Not Found")
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().send_error(code, message, explain)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("localhost", 8080), PagesLikeHandler)
    print("Our Story local preview: http://localhost:8080")
    print("Custom 404 preview:      http://localhost:8080/test-404-page")
    server.serve_forever()
