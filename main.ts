import { serveDir } from "@std/http/file-server";
import { Router } from "@fartlabs/rt";
import { router as createContract } from "#/api/contract/create/index.ts";
import { router as getContract } from "#/api/contract/get/index.ts";
import { router as createMember } from "#/api/member/create/index.ts";
import { router as getMember } from "#/api/member/get/index.ts";

const router = new Router()
  .use(createContract)
  .use(getContract)
  .use(createMember)
  .use(getMember)
  .get("/*", ({ request }) => {
    return serveDir(request, {
      fsRoot: "public",
      urlRoot: "",
      showIndex: true,
    });
  });

if (import.meta.main) {
  Deno.serve((request) => router.fetch(request));
}
