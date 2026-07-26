import { Link } from "react-router-dom";
import loomLogoUrl from "@/assets/loom-logo.png";

export function LoomLogo({ collapsed = false }) {
  return (
    <Link to="/" className="flex items-center gap-2 text-foreground">
      <span
        aria-label="Loom"
        role="img"
        className="inline-block h-9 w-9 bg-primary"
        style={{
          WebkitMaskImage: `url(${loomLogoUrl})`,
          maskImage: `url(${loomLogoUrl})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      {!collapsed && <span className="font-semibold text-lg tracking-tight">Loom</span>}
    </Link>
  );
}
