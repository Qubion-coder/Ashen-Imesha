// Single source of truth for couple names, used by the invitation and the /admin link generator.
export const GROOM_NAME = "Ashen";
export const BRIDE_NAME = "Imesha";

// Google Apps Script Web App URL (ends with /exec) that saves RSVPs and wishes to the Google Sheet.
export const RSVP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxoozG29AvXU6E-GPqpJ2ugPb4VCKt4JI-Oyen8X2NuZmx1_ZNDquHTIN8pG3-P00_kkg/exec";

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
