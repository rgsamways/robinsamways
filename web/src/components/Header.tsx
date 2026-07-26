import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-16 z-20 bg-background xl:top-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Senior Application Developer</p>
          <div className="mt-1 flex flex-col gap-1 text-sm">
            <span>
              <span className="text-accent">loc:</span> Maynooth, ON K0L 2S0
            </span>
            <span>
              <span className="text-accent">tel:</span> 613-553-0960
            </span>
            <span>
              <span className="text-accent">email:</span> rgsamways@gmail.com
            </span>
          </div>
        </div>
        <Image
          src="/images/me.png"
          alt="Robin Samways"
          width={96}
          height={96}
          className="h-[4.8rem] w-[4.8rem] shrink-0 rounded-xl object-cover"
          priority
        />
      </div>
      <hr className="mt-6 border-foreground/20" />
    </header>
  );
}
