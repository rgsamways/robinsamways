export type Sentiment = "positive" | "negative" | null;

export function canSubmitFeedback(sentiment: Sentiment, comment: string): boolean {
  return sentiment !== null || comment.trim().length > 0;
}
