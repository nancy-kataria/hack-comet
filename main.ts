Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Serve index.html for root route
  if (url.pathname === "/") {
    const file = await Deno.readFile(`public/index.html`);
    return new Response(file, {
      headers: { "content-type": "text/html" },
    });
  }

  // Default response for non-root routes
  return new Response("Not Found", { status: 404 });
});
