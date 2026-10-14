// Single source of truth for couple names, used by the invitation and the /admin link generator.
export const GROOM_NAME = "Ashen";
export const BRIDE_NAME = "Imesha";

/** Reads the personalised guest name from the URL path, e.g. /Mr.%20Sanjaya -> "Mr. Sanjaya". */
export function getGuestNameFromPath(pathname: string): string {
  const raw = pathname.replace(/^\/+|\/+$/g, "");
  if (!raw || raw.toLowerCase() === "admin") return "";
  try {
    return decodeURIComponent(raw).replace(/\s+/g, " ").trim().slice(0, 80);
  } catch {
    return "";
  }
}
