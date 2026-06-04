import type { Brand, BrandSocialLinks } from "@/lib/types";

function CourierLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
        fill="white"
      />
      <path
        d="M11.5469 5.064C12.27 4.962 12.9923 4.983 13.6953 5.116C14.4005 5.25 14.5631 6.112 14.043 6.606L11.7432 8.79C11.3354 9.177 11.3271 9.825 11.7246 10.222L13.7568 12.255C14.1609 12.659 14.8213 12.642 15.2051 12.219L17.3428 9.862C17.8292 9.326 18.7024 9.475 18.8516 10.184C19.0088 10.931 19.0415 11.7 18.9277 12.477C18.5408 15.125 16.4821 17.322 13.8594 17.857C12.3852 18.158 10.9728 17.955 9.76172 17.39L6.26302 21.381C5.19562 22.599 3.36687 22.92 2.22209 21.775C1.07797 20.63 1.39892 18.803 2.61542 17.735L6.60645 14.233C6.0368 13.011 5.83465 11.584 6.14746 10.096C6.69765 7.481 8.90125 5.438 11.5469 5.064Z"
        fill="url(#courier-footer-gradient)"
      />
      <defs>
        <linearGradient
          id="courier-footer-gradient"
          x1="9.757"
          y1="5"
          x2="9.757"
          y2="23.48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9121c2" />
          <stop offset="1" stopColor="#ff5e5e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MediumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.86 0-3.38-2.88-3.38-6.42s1.52-6.42 3.38-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<
  keyof BrandSocialLinks,
  { icon: React.FC; label: string }
> = {
  facebook: { icon: FacebookIcon, label: "Facebook" },
  instagram: { icon: InstagramIcon, label: "Instagram" },
  linkedin: { icon: LinkedInIcon, label: "LinkedIn" },
  medium: { icon: MediumIcon, label: "Medium" },
  twitter: { icon: TwitterIcon, label: "Twitter" },
};

function hasAnySocialLink(links: BrandSocialLinks): boolean {
  return Object.values(links).some((v) => v?.url?.length);
}

function FreeFooter() {
  return (
    <footer className="rounded-xl overflow-hidden">
      <a
        href="https://courier.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 no-underline"
        style={{
          background: "linear-gradient(270deg, #9121c2 1.2%, #ff5e5e 100%)",
        }}
      >
        <p className="text-white text-xs font-normal m-0 whitespace-nowrap">
          Notifications powered by
        </p>
        <CourierLogo />
        <h1 className="text-white text-sm font-bold m-0 leading-tight">
          Courier
        </h1>
      </a>
    </footer>
  );
}

function BusinessFooter({ links }: { links: BrandSocialLinks }) {
  return (
    <footer className="flex items-center justify-center gap-4 py-3 mt-3">
      {(Object.keys(SOCIAL_ICONS) as (keyof BrandSocialLinks)[]).map((key) => {
        const url = links[key]?.url;
        if (!url) return null;
        const { icon: Icon, label } = SOCIAL_ICONS[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-[#A3A3A3] hover:text-[#525252] transition-colors duration-150"
          >
            <Icon />
          </a>
        );
      })}
    </footer>
  );
}

export function Footer({
  showCourierFooter,
  brand,
}: {
  showCourierFooter: boolean;
  brand: Brand;
}) {
  if (showCourierFooter) {
    return <FreeFooter />;
  }

  const links = brand.links;
  if (!links || !hasAnySocialLink(links)) {
    return null;
  }

  return <BusinessFooter links={links} />;
}
