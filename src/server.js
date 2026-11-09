import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SERVICE_INFO = Object.freeze({
  name: "WWMWAPI",
  description: "JavaScript-based structured mail exchange system",
  status: "experimental",
  protocol: {
    status: "not-yet-defined"
  }
});

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);

  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });

  response.end(body);
}

export function createWwmwApiServer() {
  return createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && requestUrl.pathname === "/") {
      sendJson(response, 200, SERVICE_INFO);
      return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/health") {
      sendJson(response, 200, {
        status: "ok",
        service: "WWMWAPI"
      });
      return;
    }

    sendJson(response, 404, {
      error: {
        code: "NOT_FOUND",
        message: "The requested route does not exist."
      }
    });
  });
}

function startServer() {
  const host = process.env.HOST ?? "127.0.0.1";
  const port = Number(process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new TypeError("PORT must be an integer between 0 and 65535.");
  }

  const server = createWwmwApiServer();

  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === "object" && address
      ? address.port
      : port;

    console.log(`WWMWAPI listening on http://${host}:${actualPort}`);
  });

  server.on("error", (error) => {
    console.error("WWMWAPI server error:", error);
    process.exitCode = 1;
  });

  return server;
}

const isMainModule = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  startServer();
}
