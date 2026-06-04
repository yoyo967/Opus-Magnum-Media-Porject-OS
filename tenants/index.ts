/**
 * Tenant-Registry. Bis die Multi-Tenant-Auflösung (P2.4, Firebase) verdrahtet ist,
 * ist Mirrou der aktive Tenant (Tenant #1, Dogfooding — Blueprint §4a).
 */
import { MIRROU_TENANT } from './mirrou/config';
import { MIRROU_TOOL_PROMPTS } from './mirrou/prompts';
import { MIRROU_KNOWLEDGE, buildMirrouContext } from './mirrou/knowledge';

export { MIRROU_TENANT, MIRROU_TOOL_PROMPTS, MIRROU_KNOWLEDGE, buildMirrouContext };

export const ACTIVE_TENANT = MIRROU_TENANT;
export const ACTIVE_TOOL_PROMPTS = MIRROU_TOOL_PROMPTS;
