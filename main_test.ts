import { assertEquals } from "@std/assert";
import { router } from "./api/contract/create/index.ts";
import { getContractRouter } from "./api/contract/get/index.ts";

Deno.test("Creating Contract", async () => {
  const body = {
    teamName: "Ash Team",
    projectIdea: "Pokemon fetch project",
    members: [],
    firstPrototypeDate: "",
    finalProductDate: "",
    decisionMethod: "Representative Decision",
    customRules:
      "Anybody not agreeing to the decision method will not be thrown out of the team.",
    signedAgreement: false,
  };

  const response = await router.fetch(
    new Request("http://0.0.0.0:8000/api/contract/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
  const responseBody = await response.json();

  assertEquals(response.status, 201);
  assertEquals(responseBody.message, "Contract created");
  console.log("Created contract ID:", responseBody.id);

  const result = await import("./database/db.ts").then((mod) =>
    mod.db.get(["contract", responseBody.id])
  );

  assertEquals((result.value as { teamName: string }).teamName, "Ash Team");
});

Deno.test("Get the contract created", async () => {
  const response = await getContractRouter.fetch(
    new Request(
      "http://0.0.0.0:8000/api/contract/get/702e5bbc-1c66-4e76-9d8d-e56b510bc96d",
      {
        method: "GET",
      }
    )
  );

  const responseBody = await response.json();
  assertEquals(response.status, 200);
  assertEquals(responseBody.teamName, "Ash Ketchum Team");
  console.log(responseBody);
});
