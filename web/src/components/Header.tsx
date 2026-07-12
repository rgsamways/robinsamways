import Image from "next/image";
import Link from "next/link";
import Farpost from "./Farpost";
import MenuToggle from "./MenuToggle";

export default function Header() {
  return (
    <header className="z-30 bg-background lg:sticky lg:top-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <MenuToggle />
          <div>
            <h1 className="text-2xl font-bold">
              <Link href="/">
                <span className="text-accent">$</span> Robin Samways
              </Link>
            </h1>
            <p className="mt-1 text-sm text-muted">
              Senior Application Developer · Founder, <Farpost />
            </p>
            <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span>
                <span className="text-accent">tel:</span> 613-553-0960
              </span>
              <span>
                <span className="text-accent">email:</span> rgsamways@gmail.com
              </span>
              <span>loc: Maynooth, ON K0L 2S0</span>
            </div>
          </div>
        </div>
        <Image
          src="/images/headshot.png"
          alt="Robin Samways"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-xl object-cover"
          priority
        />
      </div>
      <hr className="mt-6 border-foreground/20" />
    </header>
  );
}
