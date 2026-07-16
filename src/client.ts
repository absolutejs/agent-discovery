import type { SignedAgentDiscoveryDocument } from "./types";

export type DiscoveryFetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

export const fetchAgentDocument = async ({ url, fetch: fetcher, maxBytes = 256 * 1024 }: {
  url: string;
  fetch: DiscoveryFetch;
  maxBytes?: number;
}): Promise<SignedAgentDiscoveryDocument> => {
  const target = new URL(url);
  if (target.protocol !== "https:") throw new Error("Agent discovery requires HTTPS");
  const response = await fetcher(target, { headers: { accept: "application/json" }, redirect: "error" });
  if (!response.ok) throw new Error(`Agent discovery failed with ${response.status}`);
  const length = Number(response.headers.get("content-length") ?? "0");
  if (length > maxBytes) throw new Error("Agent discovery document exceeds byte limit");
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > maxBytes) throw new Error("Agent discovery document exceeds byte limit");
  return JSON.parse(new TextDecoder().decode(bytes)) as SignedAgentDiscoveryDocument;
};
