import { Router } from "@fartlabs/rt";
import { db } from "#/database/db.ts";

export const router = new Router()
  .get("/api/member/get/:id", async ({ params }) => {
    const memberId = params?.pathname.groups?.id;

    if (!memberId) {
      return new Response(JSON.stringify({ error: "Invalid Member ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db.get(["member", memberId]);

    if (!result.value) {
      return new Response(JSON.stringify({ error: "Member not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(JSON.stringify(result.value));

    return new Response(JSON.stringify(result.value), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  })
  .default(() => new Response("Not found", { status: 404 }));
