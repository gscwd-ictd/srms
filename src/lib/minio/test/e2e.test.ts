import app from "@srms/server/app";
import { describe, it, expect } from "vitest";

describe("MinIO Functions Testing", () => {
  //   it("Should generate OpenAPI documentation", async () => {
  //     const res = await app.request("/openapi.json");
  //     expect(res.status).toBe(200);

  //     const data = await res.json();
  //     expect(data).toHaveProperty("paths");
  //     expect(data.paths).toHaveProperty("/register");
  //     expect(data.paths).toHaveProperty("/login");
  //     expect(data.paths).toHaveProperty("/profile");
  //   });

  it("Upload files", async () => {
    const res = await app.request("/register", {
      method: "POST",
      body: JSON.stringify({ username: "honoUser", password: "securePass123" }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data).toHaveProperty("message", "User registered");
  });

  it("Should fail authentication with an invalid token", async () => {
    const res = await app.request("/profile", {
      method: "GET",
      headers: { Authorization: "Bearer invalidtoken123" },
    });

    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data).toHaveProperty("message", "Invalid token");
  });
});
