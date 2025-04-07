import { assertEquals } from "@std/assert";
import { router as createContract } from "./api/contract/create/index.ts";
import { router as getContract } from "./api/contract/get/index.ts";
import { router as createMember } from "./api/member/create/index.ts";
import { router as getMember } from "./api/member/get/index.ts";

Deno.test("Creating Contract", async () => {
  const body = {
    teamName: "Ronin Hellen Team",
    projectIdea: "Pokemon fetch project",
    teamLead: "Ray Meysterio",
    members: [],
    firstPrototypeDate: "",
    finalProductDate: "",
    decisionMethod: "Representative Decision",
    customRules:
      "Anybody not agreeing to the decision method will not be thrown out of the team.",
    signedAgreement: true,
  };

  const response = await createContract.fetch(
    new Request("http://0.0.0.0:8000/api/contract/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  const responseBody = await response.json();

  assertEquals(response.status, 201);
  assertEquals(responseBody.message, "Contract created");
  console.log("Created contract ID:", responseBody.id);

  const result = await import("./database/db.ts").then((mod) =>
    mod.db.get(["contract", responseBody.id])
  );

  assertEquals(
    (result.value as { teamName: string }).teamName,
    "Ronin Hellen Team",
  );
});

Deno.test("Get the contract created", async () => {
  const response = await getContract.fetch(
    new Request(
      "http://0.0.0.0:8000/api/contract/get/012d9014-33dd-459e-8393-5400982bae1d",
      {
        method: "GET",
      },
    ),
  );

  const responseBody = await response.json();
  assertEquals(response.status, 200);
  assertEquals(responseBody.teamName, "wcs");
  console.log(responseBody);
});

Deno.test("Creating Member", async () => {
  const body = {
    name: "Nancy Kam",
    role: "AI Engineer",
    email: "katarianancy8@gmail.com",
  };

  const response = await createMember.fetch(
    new Request("http://0.0.0.0:8000/api/member/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  const responseBody = await response.json();

  assertEquals(response.status, 201);
  assertEquals(responseBody.message, "Member created");
  console.log("Created member ID:", responseBody.id);

  const result = await import("./database/db.ts").then((mod) =>
    mod.db.get(["member", responseBody.id])
  );

  assertEquals((result.value as { name: string }).name, "Nancy Kam");
});

Deno.test("Get the member created", async () => {
  const response = await getMember.fetch(
    new Request(
      "http://0.0.0.0:8000/api/member/get/4ee1a7ab-9d7b-401c-bd78-fa8bd1ffaca8",
      {
        method: "GET",
      },
    ),
  );

  const responseBody = await response.json();
  assertEquals(response.status, 200);
  assertEquals(responseBody.name, "Nancy Kataria");
  console.log(responseBody);
});
