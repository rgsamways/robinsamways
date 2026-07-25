import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Atlas/Dispatch/Pulse moved from Farpost's own tab bar to the
      // top-level Experiments group (restructure-left-nav).
      {
        source: "/farpost/farpost-atlas",
        destination: "/techstacks/farpost-atlas",
        permanent: true,
      },
      {
        source: "/farpost/farpost-atlas/:buildingId",
        destination: "/techstacks/farpost-atlas/:buildingId",
        permanent: true,
      },
      {
        source: "/farpost/farpost-dispatch",
        destination: "/techstacks/farpost-dispatch",
        permanent: true,
      },
      {
        source: "/farpost/farpost-pulse/dashboard",
        destination: "/techstacks/farpost-pulse/dashboard",
        permanent: true,
      },
      {
        source: "/farpost/farpost-pulse/:techId",
        destination: "/techstacks/farpost-pulse/:techId",
        permanent: true,
      },
      {
        source: "/farpost/farpost-pulse",
        destination: "/techstacks/farpost-pulse",
        permanent: true,
      },
      // Code Showcase's article routes flattened to be direct children of
      // Dev Log; its intermediate hub retired entirely (restructure-left-nav).
      {
        source: "/dev-log/code-showcase/:slug",
        destination: "/dev-log/:slug",
        permanent: true,
      },
      {
        source: "/dev-log/code-showcase",
        destination: "/dev-log",
        permanent: true,
      },
      // Superseded by per-Work-project pages under /farpost, /vocare, /sreditor.
      {
        source: "/dev-log/bug-log",
        destination: "/dev-log",
        permanent: true,
      },
      {
        source: "/dev-log/testing-verification",
        destination: "/dev-log",
        permanent: true,
      },
      {
        source: "/dev-log/glossary",
        destination: "/dev-log",
        permanent: true,
      },
      {
        source: "/dev-log/lightbulbs",
        destination: "/dev-log",
        permanent: true,
      },
      // Moved from Writing/Dev Log to Site (restructure-left-nav).
      {
        source: "/dev-log/metrics",
        destination: "/metrics",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
