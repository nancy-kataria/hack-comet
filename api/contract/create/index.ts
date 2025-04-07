import { Router } from "@fartlabs/rt";
import { db } from "#/database/db.ts";
import { Contract } from "#/models/contract.ts";

export const router = new Router()
  .post("/api/contract/create", async (req) => {
    const id = crypto.randomUUID();
    const body = await req.request.json();
    const contract = new Contract(
      id,
      body.teamName,
      body.teamLead,
      body.projectIdea,
      body.members,
      body.firstPrototypeDate,
      body.finalProductDate,
      body.decisionMethod,
      body.customRules,
      body.signedAgreement,
    );

    console.log(contract);
    if (!contract.validate()) {
      throw new Error("Invalid contract");
    }

    console.log(id);
    await db.set(["contract", id], body);
    return new Response(JSON.stringify({ message: "Contract created", id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  })
  .default(() => new Response("Not found", { status: 404 }));
