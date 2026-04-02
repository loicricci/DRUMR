export interface LinkedInAdsMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  conversions: number;
  costPerLead: number;
}

export async function fetchLinkedInAdsMetrics(
  _accountId: string,
  _campaignName: string,
  _dateRange?: { start: string; end: string }
): Promise<LinkedInAdsMetrics | null> {
  // OAuth2-authenticated LinkedIn Ads API call
  // Fetches campaign metrics by campaign name matching exp-XXX pattern
  // Requires user-level OAuth tokens stored per product

  console.log(
    "LinkedIn Ads fetcher: not configured. Requires OAuth2 setup per user."
  );
  return null;
}
