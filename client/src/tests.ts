export type TestResult = {
  id: string;
  response: {
    body?: unknown;
    status?: number;
    success: boolean;
  };
  error?: string;
};

export type TestDefinition = {
  id: string;
  name: string;
  description: string;
  explanation: string;
  request: {
    body?: unknown;
    credentials?: RequestCredentials;
    endpoint: string;
    headers?: Record<string, string>;
    method: string;
  };
};

export const TESTS: TestDefinition[] = [
  {
    description: 'Basic GET request with CORS allowed',
    explanation:
      "This request succeeded. It's a simple GET request (no custom headers, no credentials), so no preflight was needed. The server returned Access-Control-Allow-Origin set to this page's origin. The browser saw the origin match and allowed JavaScript to read the response.",
    id: 'simple-allowed',
    name: 'Simple GET (Allowed)',
    request: {
      endpoint: '/simple-allowed',
      method: 'GET',
    },
  },
  {
    description: 'Basic GET request with CORS blocked',
    explanation:
      "This request failed. It's a simple GET request, but the server did not allow this page's origin. Access-Control-Allow-Origin in the response is different from this page's origin. The browser received the response, but blocked JavaScript from reading it due to CORS policy.",
    id: 'simple-blocked',
    name: 'Simple GET (Blocked)',
    request: {
      endpoint: '/simple-blocked',
      method: 'GET',
    },
  },
  {
    description: 'POST with custom headers - preflight allowed',
    explanation:
      "This request succeeded. The browser first sent a preflight OPTIONS request (because of the custom headers). The server's preflight response allowed the headers via Access-Control-Allow-Headers. Access-Control-Allow-Origin matched this page's origin, so the browser then sent the real POST.",
    id: 'preflight-allowed',
    name: 'Preflight POST (Allowed)',
    request: {
      endpoint: '/preflight-allowed',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Custom': 'test' },
      body: { data: 'test' },
    },
  },
  {
    description: 'POST with custom headers - preflight blocked',
    explanation:
      "This request failed. The browser sent a preflight OPTIONS request for POST with custom headers. The server's preflight response did not include X-Custom in Access-Control-Allow-Headers. The browser treated the preflight as a denial and never sent the actual POST.",
    id: 'preflight-blocked',
    name: 'Preflight POST (Blocked)',
    request: {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom': 'test',
      },
      body: { data: 'test' },
      endpoint: '/preflight-blocked',
      method: 'POST',
    },
  },
  {
    id: 'credentials-allowed',
    name: 'Credentials (Allowed)',
    request: {
      endpoint: '/credentials-allowed',
      method: 'GET',
      credentials: 'include',
    },
    description: 'GET with credentials - CORS configured to allow',
    explanation:
      "This request succeeded. The client sent the request with credentials: 'include'. The server responded with Access-Control-Allow-Credentials: true. Access-Control-Allow-Origin was set to this page's origin (not *), so the browser allowed credentials and exposed the response.",
  },
  {
    id: 'credentials-blocked',
    name: 'Credentials (Blocked)',
    request: {
      endpoint: '/credentials-blocked',
      method: 'GET',
      credentials: 'include',
    },
    description: 'GET with credentials - CORS misconfiguration blocks it',
    explanation:
      "This request failed. The client sent the request with credentials: 'include' (cookies). The server used Access-Control-Allow-Origin: * together with Access-Control-Allow-Credentials: true. Browsers forbid this combination, so they block the response and prevent JavaScript from reading it.",
  },
];
