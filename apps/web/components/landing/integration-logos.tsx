import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function GitHubLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.48 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12 24 5.37 18.63 0 12 0z" />
    </svg>
  );
}

export function GoogleAnalyticsLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      <path
        d="M4 18.5V16.2C4 14.43 5.43 13 7.2 13H9.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M9.5 13V7.2C9.5 5.43 10.93 4 12.7 4H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="17.5" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="7.2" cy="18.5" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12.7" cy="7.2" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function GoogleAdsLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      <path
        d="M6.5 18.5L12 5.5L14.2 11.2L18.5 18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="18.5" r="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18.5" cy="18.5" r="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="5.5" r="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function XLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ClaudeLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.365-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.018-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.171-.619a2.97 2.97 0 01-.102-.729L6.012.06 6.415 0l.972.134.41.354.602 1.377.976 2.172 1.514 2.95.443.875.237.81.088.249h.155V9.79l.122-1.638.227-2.01.219-2.588.075-.731.36-.882.711-.467.555.265.459.673-.064.428-.275 1.784-.539 2.794-.351 1.873h.206l.236-.236.954-1.265 1.604-2.005.708-.798.825-.879.532-.42h1.004l.74 1.1-.331 1.137-1.035 1.31-.857 1.111-1.228 1.654-.768 1.325.072.108.183-.019 2.795-.595 1.51-.273 1.802-.31.815.384.09.387-.32.79-1.927.477-2.262.45-3.367.797-.04.03.046.057 1.518.144.649.036h1.588l2.958.22.773.512.464.626-.078.475-1.19.607-1.605-.382-3.748-.892-1.286-.322h-.178v.108l1.071 1.046 1.957 1.768 2.45 2.28.124.566-.314.444-.331-.047-2.146-1.612-.828-.727-1.873-1.578h-.124v.166l.431.633 2.281 3.428.119 1.05-.165.343-.591.207-.649-.118-1.336-1.873-1.376-2.105-1.114-1.893-.135.077-.658 7.075-.308.362-.711.272-.593-.45-.315-.728.315-1.444.38-1.879.308-1.495.278-1.86.166-.617-.011-.041-.135.018-1.39 1.907-2.119 2.864-1.677 1.794-.402.157-.696-.361.065-.642.388-.572 2.32-2.95 1.398-1.83.901-1.055-.006-.153h-.052L4.482 18.36l-1.214.157-.523-.49.065-.804.247-.26 2.034-1.397-.343.077z" />
    </svg>
  );
}

export function OpenAILogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.5234 4.4992zM3.0457 18.5853a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.504 4.504 0 0 1-6.6944-1.3649zM1.5742 7.8898a4.4992 4.4992 0 0 1 2.3604-1.9786V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 1.5742 7.8898zm16.5862 3.8558L12.3456 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4992 4.4992 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4067-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.504 4.504 0 0 1 6.6896 4.6663zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.504 4.504 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.602 1.4997-2.6067-1.4997z" />
    </svg>
  );
}

export function SlackLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.685 8.834a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.164 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.164 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.164 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zM15.164 17.685a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.313A2.527 2.527 0 0 1 24 15.164a2.528 2.528 0 0 1-2.523 2.521h-6.313z" />
    </svg>
  );
}

const integrations = [
  { name: "GitHub", Logo: GitHubLogo },
  { name: "Claude", Logo: ClaudeLogo },
  { name: "ChatGPT", Logo: OpenAILogo },
  { name: "Slack", Logo: SlackLogo },
  { name: "Google Analytics", Logo: GoogleAnalyticsLogo },
  { name: "Google Ads", Logo: GoogleAdsLogo },
  { name: "X Ads", Logo: XLogo },
] as const;

export function IntegrationLogos({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-14 gap-y-6",
        className
      )}
    >
      {integrations.map(({ name, Logo }) => (
        <div
          key={name}
          className="group flex items-center gap-3 text-landing-muted-fg transition-colors hover:text-landing-fg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all group-hover:border-landing-accent/25 group-hover:bg-landing-accent/10">
            <Logo />
          </div>
          <span className="font-brand text-sm font-medium tracking-wide">{name}</span>
        </div>
      ))}
    </div>
  );
}
