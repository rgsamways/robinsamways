"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { canSubmitFeedback, type Sentiment } from "./feedback";

type Status = "idle" | "submitting" | "success" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [sentiment, setSentiment] = useState<Sentiment>(null);
  const [comment, setComment] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [renderedAt] = useState(() => Date.now() / 1000);
  const [status, setStatus] = useState<Status>("idle");

  if (pathname === "/") return null;

  function toggleSentiment(next: "positive" | "negative") {
    setSentiment((current) => (current === next ? null : next));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmitFeedback(sentiment, comment)) return;

    setStatus("submitting");
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          sentiment,
          comment: comment.trim() || null,
          honeypot,
          rendered_at: renderedAt,
        }),
      });
      if (!response.ok) throw new Error("request failed");
      setStatus("success");
      setSentiment(null);
      setComment("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-12 border-t border-foreground/20 pt-6">
      {status === "success" ? (
        <p className="text-sm">
          <span className="text-accent">›</span> Thanks for the feedback.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4 text-sm">
          <div className="absolute -left-[9999px]">
            <label htmlFor="feedback-website">Website</label>
            <input
              id="feedback-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <p className="font-semibold text-accent">Feedback on this page</p>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Positive reaction"
              aria-pressed={sentiment === "positive"}
              onClick={() => toggleSentiment("positive")}
              className={
                sentiment === "positive"
                  ? "flex h-8 w-8 items-center justify-center rounded border border-accent bg-accent text-background"
                  : "flex h-8 w-8 items-center justify-center rounded border border-foreground/20 text-muted transition hover:border-accent hover:text-accent"
              }
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Negative reaction"
              aria-pressed={sentiment === "negative"}
              onClick={() => toggleSentiment("negative")}
              className={
                sentiment === "negative"
                  ? "flex h-8 w-8 items-center justify-center rounded border border-accent bg-accent text-background"
                  : "flex h-8 w-8 items-center justify-center rounded border border-foreground/20 text-muted transition hover:border-accent hover:text-accent"
              }
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
            placeholder="Anything you want to add? (optional)"
            className="w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
          />

          <button
            type="submit"
            disabled={!canSubmitFeedback(sentiment, comment) || status === "submitting"}
            className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
          >
            {status === "submitting" ? "Sending…" : "Send feedback"}
          </button>

          {status === "error" && (
            <p className="text-xs">Something went wrong — please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}
