import { resolveApiBaseUrl } from '../../../src/api/client';

describe('Unit Test: Dynamic API Base URL Resolution', () => {
  test('RED-FE-URL-01: should prioritize custom production/staging URL when provided', () => {
    const customUrl = 'https://api.nomadix.vn/api/v1';
    const resolvedUrl = resolveApiBaseUrl(customUrl, null);
    expect(resolvedUrl).toBe('https://api.nomadix.vn/api/v1');
  });

  test('RED-FE-URL-02: should dynamically resolve host IP from Metro scriptURL across any Wi-Fi network', () => {
    const metroScriptURL = 'http://192.168.1.88:8081/index.bundle?platform=android&dev=true';
    const resolvedUrl = resolveApiBaseUrl(null, metroScriptURL);
    expect(resolvedUrl).toBe('http://192.168.1.88:5001/api/v1');
  });

  test('RED-FE-URL-03: should fallback to active Mac IP http://192.168.1.26:5001/api/v1 by default', () => {
    const resolvedUrl = resolveApiBaseUrl(null, null);
    expect(resolvedUrl).toBe('http://192.168.1.26:5001/api/v1');
  });
});
