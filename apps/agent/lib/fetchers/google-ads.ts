export interface GoogleAdsMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  costMicros: number;
  conversions: number;
}

export async function fetchGoogleAdsMetrics(
  _customerId: string,
  _campaignName: string,
  _dateRange?: { start: string; end: string }
): Promise<GoogleAdsMetrics | null> {
  // OAuth2-authenticated Google Ads API v17 call
  // Fetches campaign metrics by campaign name matching exp-XXX pattern
  // Requires user-level OAuth tokens stored per product

  console.log(
    "Google Ads fetcher: not configured. Requires OAuth2 setup per user."
  );
  return null;
}
