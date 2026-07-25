import type { ReactNode } from "react";

// The `$`-prefixed page heading + description block, hand-written on every
// page until now — including the exact `{" "}` immediately after the
// closing `</span>` that fixes the JSX whitespace-glue bug (a literal text
// node's leading space silently dropped after a closing inline tag, hit 17
// times during left-nav-restructure). Centralizing it here means that fix
// only has to exist once, not be reproduced correctly at every call site.
export default function PageHeading({
  title,
  headingClassName = "text-xl font-bold",
  descriptionClassName = "mt-2 text-sm text-muted",
  children,
}: {
  title: ReactNode;
  headingClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <h1 className={headingClassName}>
        <span className="text-accent">$</span>{" "}
        {title}
      </h1>
      {children ? <p className={descriptionClassName}>{children}</p> : null}
    </>
  );
}
