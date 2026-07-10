"use client";

import HamburgerMenu from "./HamburgerMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/method", label: "Method" },
  { href: "/narrative", label: "Narrative" },
  { href: "/farpost", label: "Farpost" },
  { href: "/dev-log", label: "Dev Log" },
];

export default function MenuToggle() {
  return <HamburgerMenu links={links} ariaLabel="menu" />;
}
