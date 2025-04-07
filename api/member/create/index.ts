import { Router } from "@fartlabs/rt";
import { db } from "#/database/db.ts";
import { TeamMember } from "#/models/teamMember.ts";

export const router = new Router()
  .post("/api/member/create", async (req) => {
    const id = crypto.randomUUID();
    const body = await req.request.json();

    const member = new TeamMember(body.name, body.role, body.email);
    if (!member.validate()) {
      throw new Error("Invalid contract");
    }

    console.log(id);

    await db.set(["member", id], member);

    return new Response(JSON.stringify({ message: "Member created", id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  })
  .default(() => new Response("Not found", { status: 404 }));
