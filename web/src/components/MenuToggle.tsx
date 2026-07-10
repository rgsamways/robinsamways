"use client";

import HamburgerMenu from "./HamburgerMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/farpost", label: "Farpost" },
  { href: "/dev-log", label: "Dev Log" },
  { href: "/sreditor", label: "Sreditor" },
];

export default function MenuToggle() {
  return <HamburgerMenu links={links} ariaLabel="menu" />;
}
