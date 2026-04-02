export interface ResendEmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  openRate: number;
  clickRate: number;
}

export async function fetchResendMetrics(
  _audienceId: string,
  _experimentSlug: string,
  _dateRange?: { start: string; end: string }
): Promise<ResendEmailMetrics | null> {
  // Resend API call to fetch email analytics
  // Uses global RESEND_API_KEY env var
  // Filters emails by experiment slug tag to scope metrics per experiment

  console.log(
    "Resend fetcher: not configured. Requires audience setup and email tagging."
  );
  return null;
}
