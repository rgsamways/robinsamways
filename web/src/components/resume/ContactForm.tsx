"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = { name?: string; email?: string; message?: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [renderedAt] = useState(() => Date.now() / 1000);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = () => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (!message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          honeypot,
          rendered_at: renderedAt,
        }),
      });
      if (!response.ok) throw new Error("request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm">
        <span className="text-accent">›</span>{" "}
        Thanks — your message has been sent. I&rsquo;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4 text-sm">
      <div className="absolute -left-[9999px]">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className="block font-semibold text-accent">
          name
        </label>
        <input
          id="contact-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-xs">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="block font-semibold text-accent">
          email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
        />
        {errors.email && <p className="mt-1 text-xs">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="block font-semibold text-accent">
          message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
        />
        {errors.message && <p className="mt-1 text-xs">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>

      {status === "error" && (
        <p className="text-xs">
          Something went wrong — please try again, or email directly at{" "}
          <a href="mailto:rgsamways@gmail.com" className="text-accent underline">
            rgsamways@gmail.com
          </a>
          .
        </p>
      )}
    </form>
  );
}
