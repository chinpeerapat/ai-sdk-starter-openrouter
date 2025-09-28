export async function GET() {
  try {
    const cacheTtlSeconds = 3600; // 1 hour
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      // Public endpoint; no auth required for full catalog
      // If you want to filter by user/provider preferences, call /api/v1/models/user with Authorization
      headers: {
        Accept: "application/json",
      },
      // Cache on the server for the TTL; Next.js will revalidate in the background
      next: { revalidate: cacheTtlSeconds },
    });

    if (!response.ok) {
      return new Response("Failed to fetch models from OpenRouter", {
        status: 502,
      });
    }

    const data = await response.json();
    return Response.json(data, {
      headers: {
        // Enable CDN caching for faster client loads; serve stale while revalidating
        "Cache-Control": `public, s-maxage=${cacheTtlSeconds}, stale-while-revalidate=86400`,
      },
    });
  } catch (error) {
    console.error("/api/models error", error);
    return new Response("Unexpected error fetching models", { status: 500 });
  }
}


