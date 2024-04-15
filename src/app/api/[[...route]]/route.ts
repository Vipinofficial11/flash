import { Hono } from "hono";
import { cors } from "hono/cors";
import { envConfig } from "@/utils/Types";
import { env } from "hono/adapter";
import { Redis } from "@upstash/redis/cloudflare";
import { handle } from "hono/vercel";

// Defining the runtime, as we are using cloudflare workers which is a JS edge runtime on Cloudflare CDN.
export const runtime = "edge";

// Setting the base url path while creating the app instance.
const app = new Hono().basePath("/api/v1");

// Using hono cors to avoid cors errors.
app.use("/*", cors());

app.get("/search", async (c) => {
  try {
    const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
      env<envConfig>(c);
    // Used to compute the performance of the query.
    // Start performance.
    const start = performance.now();
    const redis = new Redis({
      token: UPSTASH_REDIS_REST_TOKEN,
      url: UPSTASH_REDIS_REST_URL,
    });

    // Making query upper case because we will be storing country names in DB as upper case.
    const query = c.req.query("q")?.toUpperCase();
    if (!query) {
      return c.json({ message: "Invalid Search Query" }, { status: 400 });
    }

    const result = [];
    const rank = await redis.zrank("terms", query);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 100);

      for (const element of temp) {
        if (!element.startsWith(query)) {
          break;
        }

        if (element.endsWith("*")) {
          result.push(element.substring(0, element.length - 1));
        }
      }
    }
    // End performance.
    const end = performance.now();

    return c.json({ results: result, duration: end - start });
  } catch (err) {
    console.error(err);
    return c.json({ message: "Something went wrong" }, { status: 500 });
  }
});

export const GET = handle(app);
// Commenting this because next.js doesn't allow exporting the app.
// We are not deploying the backend on next so not a problem.
// export default app;
