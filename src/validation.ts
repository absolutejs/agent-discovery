import {
  ABSOLUTE_AGENT_SCHEMA,
  type AgentDiscoveryDocument,
  type AgentInterface,
} from "./types";

const HTTPS_FIELDS = [
  "id",
  "url",
  "statusUrl",
  "privacyUrl",
  "termsUrl",
  "iconUrl",
  "documentationUrl",
] as const;

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const unique = (values: readonly string[]) => new Set(values).size === values.length;

export const validateAgentDocument = (
  value: AgentDiscoveryDocument,
  now = Date.now(),
): readonly string[] => {
  const errors: string[] = [];
  if (value.$schema !== ABSOLUTE_AGENT_SCHEMA) errors.push("unsupported schema");
  if (!value.name.trim()) errors.push("name is required");
  if (!value.description.trim()) errors.push("description is required");
  if (!value.version.trim()) errors.push("version is required");
  if (!value.publisher?.id || !value.publisher.name) errors.push("publisher is required");
  if (!value.capabilities.length) errors.push("at least one capability is required");
  if (!value.interfaces.length) errors.push("at least one interface is required");
  for (const field of HTTPS_FIELDS) {
    const candidate = value[field];
    if (candidate && !isHttpsUrl(candidate)) errors.push(`${field} must be an HTTPS URL`);
  }
  for (const [index, item] of value.interfaces.entries()) {
    if (!isHttpsUrl(item.url)) errors.push(`interfaces[${index}].url must be an HTTPS URL`);
  }
  const capabilityIds = value.capabilities.map(({ id }) => id);
  if (!unique(capabilityIds)) errors.push("capability ids must be unique");
  if (value.expiresAt && Date.parse(value.expiresAt) <= now) errors.push("document expired");
  if (!Number.isFinite(Date.parse(value.createdAt))) errors.push("createdAt is invalid");
  if (!Number.isFinite(Date.parse(value.updatedAt))) errors.push("updatedAt is invalid");
  if (Date.parse(value.updatedAt) < Date.parse(value.createdAt))
    errors.push("updatedAt precedes createdAt");
  return errors;
};

export const interfaceOf = (
  document: AgentDiscoveryDocument,
  type: AgentInterface["type"],
) => document.interfaces.find((candidate) => candidate.type === type);
