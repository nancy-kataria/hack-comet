import { Router } from "@fartlabs/rt";
import { db } from "./../../../database/db.ts";

export const router = new Router()
  .post("/api/contract/create", async (req) => {
    const body = await req.request.json();

    const id = crypto.randomUUID();
    console.log(id);

    await db.set(["contract", id], body);

    return new Response(JSON.stringify({ message: "Contract created", id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  })
  .default(() => new Response("Not found", { status: 404 }));

Deno.serve((request) => router.fetch(request));
