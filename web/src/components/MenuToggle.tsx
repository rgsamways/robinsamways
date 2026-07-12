"use client";

import HamburgerMenu from "./HamburgerMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/farpost", label: "Farpost" },
  { href: "/sreditor", label: "Sreditor" },
  { href: "/techstacks", label: "Tech/Stacks" },
  { href: "/dev-log", label: "Dev Log" },
];

export default function MenuToggle() {
  return <HamburgerMenu links={links} ariaLabel="menu" />;
}
