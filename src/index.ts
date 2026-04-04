const BASE_URL = 'https://api.enrow.io';

export interface FindEmailParams {
  apiKey: string;
  fullName: string;
  companyDomain?: string;
  companyName?: string;
  countryCode?: string;
  webhook?: string;
}

export interface FindEmailsParams {
  apiKey: string;
  searches: Array<{
    fullName: string;
    companyDomain?: string;
    companyName?: string;
    custom?: Record<string, unknown>;
  }>;
  countryCode?: string;
  webhook?: string;
}

export interface EmailResult {
  id: string;
  email?: string;
  qualification?: string;
  status?: string;
  message?: string;
  creditsUsed?: number;
}

export interface BulkEmailResult {
  batchId: string;
  total: number;
  status: string;
  creditsUsed?: number;
}

export interface BulkEmailResults {
  batchId: string;
  status: string;
  total: number;
  completed?: number;
  creditsUsed?: number;
  results?: EmailResult[];
}

async function request(apiKey: string, method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `API error ${res.status}`);
  return data;
}

export async function findEmail(params: FindEmailParams): Promise<EmailResult> {
  const body: Record<string, unknown> = { fullname: params.fullName };
  if (params.companyDomain) body.company_domain = params.companyDomain;
  if (params.companyName) body.company_name = params.companyName;
  if (params.countryCode || params.webhook) {
    body.settings = {
      ...(params.countryCode && { country_code: params.countryCode }),
      ...(params.webhook && { webhook: params.webhook }),
    };
  }
  return request(params.apiKey, 'POST', '/email/find/single', body);
}

export async function getEmailResult(apiKey: string, id: string): Promise<EmailResult> {
  return request(apiKey, 'GET', `/email/find/single?id=${id}`);
}

export async function findEmails(params: FindEmailsParams): Promise<BulkEmailResult> {
  const body: Record<string, unknown> = {
    searches: params.searches.map((s) => ({
      fullname: s.fullName,
      ...(s.companyDomain && { company_domain: s.companyDomain }),
      ...(s.companyName && { company_name: s.companyName }),
      ...(s.custom && { custom: s.custom }),
    })),
  };
  if (params.countryCode || params.webhook) {
    body.settings = {
      ...(params.countryCode && { country_code: params.countryCode }),
      ...(params.webhook && { webhook: params.webhook }),
    };
  }
  return request(params.apiKey, 'POST', '/email/find/bulk', body);
}

export async function getEmailResults(apiKey: string, id: string): Promise<BulkEmailResults> {
  return request(apiKey, 'GET', `/email/find/bulk?id=${id}`);
}
