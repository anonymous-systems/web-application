// Controlled vocabulary for comment reports. The runtime arrays feed the report
// dialog, the rules specs and the admin filter; the union types are derived from
// them so the allowed values are defined exactly once.

export const REPORT_REASONS = [
  'spam',
  'harassment',
  'hate',
  'misinformation',
  'other',
] as const
export type ReportReason = (typeof REPORT_REASONS)[number]

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: 'Spam or misleading',
  harassment: 'Harassment or bullying',
  hate: 'Hateful or abusive',
  misinformation: 'Misinformation',
  other: 'Something else',
}

// `open` until a moderator looks at it; `reviewed` once actioned or dismissed.
// Deleting the comment removes its reports with it, so there is no
// "actioned" state to distinguish — the evidence goes with the offence.
export const REPORT_STATUSES = ['open', 'reviewed'] as const
export type ReportStatus = (typeof REPORT_STATUSES)[number]
