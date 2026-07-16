import { defineManifest } from "@absolutejs/manifest";
import { Type } from "@sinclair/typebox";

export const manifest = defineManifest<Record<string, never>>()({
  contract: 2,
  identity: {
    accent: "#06b6d4",
    category: "ai",
    description:
      "Signed provider-neutral AI agent descriptors with a live JSON Schema, interoperable well-known endpoints, A2A, MCP, Arazzo, and WebMCP interfaces, searchable registries, and durable PostgreSQL storage.",
    docsUrl: "https://github.com/absolutejs/agent-discovery",
    name: "@absolutejs/agent-discovery",
    tagline:
      "Make trustworthy AbsoluteJS agents easier to find than any other agent.",
  },
  settings: Type.Object({}),
  wiring: [],
});
