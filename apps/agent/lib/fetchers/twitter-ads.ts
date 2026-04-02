export interface TwitterAdsMetrics {
  impressions: number;
  engagements: number;
  engagementRate: number;
  clicks: number;
  spend: number;
}

export async function fetchTwitterAdsMetrics(
  _accountId: string,
  _campaignName: string,
  _dateRange?: { start: string; end: string }
): Promise<TwitterAdsMetrics | null> {
  // OAuth2-authenticated Twitter/X Ads API v12 call
  // Fetches engagement metrics by campaign
  // Requires user-level OAuth tokens stored per product

  console.log(
    "Twitter Ads fetcher: not configured. Requires OAuth2 setup per user."
  );
  return null;
}
