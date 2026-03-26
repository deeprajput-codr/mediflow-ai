import type { CrowdLevel } from "@/data/hospitals";

const CrowdBadge = ({ level, size = "sm" }: { level: CrowdLevel; size?: "sm" | "lg" }) => {
  const colors = {
    Low: "bg-crowd-low/15 text-crowd-low border-crowd-low/30",
    Medium: "bg-crowd-medium/15 text-crowd-medium border-crowd-medium/30",
    High: "bg-crowd-high/15 text-crowd-high border-crowd-high/30",
  };

  const dotColors = {
    Low: "bg-crowd-low",
    Medium: "bg-crowd-medium",
    High: "bg-crowd-high",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${colors[level]} ${
        size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs"
      }`}
    >
      <span className={`w-2 h-2 rounded-full animate-pulse-glow ${dotColors[level]}`} />
      {level}
    </span>
  );
};

export default CrowdBadge;
