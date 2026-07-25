import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";
import FontSizeSetting from "@/components/settings/FontSizeSetting";
import ReducedMotionSetting from "@/components/settings/ReducedMotionSetting";
import ThemeSetting from "@/components/settings/ThemeSetting";

export const metadata: Metadata = {
  title: "Settings · Robin Samways",
};

export default function SettingsPage() {
  return (
    <main className="py-10">
      <PageHeading title="Settings">
        Display and accessibility preferences for this site — applied
        immediately and everywhere, not just here.
      </PageHeading>

      <section>
        <SectionHeader title="THEME" />
        <p className="mb-4 text-sm leading-relaxed">
          Light or dark. Defaults to your OS preference until you choose one
          explicitly.
        </p>
        <ThemeSetting />
      </section>

      <section>
        <SectionHeader title="FONT_SIZE" />
        <p className="mb-4 text-sm leading-relaxed">
          Scales all text on the site proportionally — nothing to configure
          per page.
        </p>
        <FontSizeSetting />
      </section>

      <section>
        <SectionHeader title="REDUCED_MOTION" />
        <p className="mb-4 text-sm leading-relaxed">
          System follows your OS&rsquo;s reduced-motion setting; On or Off
          overrides it either way. Actually disables the nav rail&rsquo;s
          slide animation and the on-page outline&rsquo;s smooth
          scroll-to-section, not just a stored flag.
        </p>
        <ReducedMotionSetting />
      </section>
    </main>
  );
}
