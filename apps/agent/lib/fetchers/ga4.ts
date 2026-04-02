export interface GA4Metrics {
  pageViews: number;
  scrollDepth: number;
  signupEvents: number;
  bounceRate: number;
}

export async function fetchGA4Metrics(
  _propertyId: string,
  _landingPageUrl: string,
  _dateRange?: { start: string; end: string }
): Promise<GA4Metrics | null> {
  // OAuth2-authenticated GA4 Data API call
  // Requires user-level OAuth tokens stored per product
  // Implementation depends on googleapis npm package + stored refresh tokens

  console.log(
    "GA4 fetcher: not configured. Requires OAuth2 setup per user."
  );
  return null;
}
