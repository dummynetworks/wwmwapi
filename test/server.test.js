import test from "node:test";
import assert from "node:assert/strict";
import { createWwmwApiServer } from "../src/server.js";

async function withServer(run) {
  const server = createWwmwApiServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test("GET / returns WWMWAPI service metadata", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(baseUrl);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.name, "WWMWAPI");
    assert.equal(body.status, "experimental");
    assert.equal(body.protocol.status, "not-yet-defined");
  });
});

test("GET /health returns an OK status", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      status: "ok",
      service: "WWMWAPI"
    });
  });
});

test("unknown routes return a structured 404 response", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/does-not-exist`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, "NOT_FOUND");
  });
});
