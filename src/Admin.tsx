import React, { useEffect, useState } from "react";
import { Check, Copy, Link as LinkIcon, MessageCircle } from "lucide-react";
import { BRIDE_NAME, GROOM_NAME } from "./weddingConfig";

const PREFIXES = ["Mr.", "Mrs.", "Miss", "Mr. & Mrs.", "Family", "Dear"] as const;
type Prefix = (typeof PREFIXES)[number];

/** Combines prefix + name. "Dear" adds nothing here because the greeting already starts with "Dear". */
function buildDisplayName(prefix: Prefix, name: string): string {
  const cleanName = name.replace(/\s+/g, " ").trim();
  if (!cleanName) return "";
  switch (prefix) {
    case "Family":
      return `${cleanName} and Family`;
    case "Dear":
      return cleanName;
    default:
      return `${prefix} ${cleanName}`;
  }
}

function buildMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for older browsers / non-secure contexts
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }
}

export default function Admin() {
  const [prefix, setPrefix] = useState<Prefix>("Mr.");
  const [guestName, setGuestName] = useState("");
  const [generated, setGenerated] = useState<{ displayName: string; link: string; message: string } | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Invitation Links · ${GROOM_NAME} & ${BRIDE_NAME}`;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      setError("Please enter a guest name.");
      setGenerated(null);
      return;
    }
    setError("");
    const link = `${window.location.origin}/${encodeURIComponent(displayName)}`;
    setGenerated({ displayName, link, message: buildMessage(displayName, link) });
  };

  const handleCopy = async (text: string, label: string) => {
    await copyText(text);
    setToast(label);
  };

  const previewName = buildDisplayName(prefix, guestName);

  return (
    <main className="h-[100dvh] w-full overflow-y-auto bg-theme-50 font-montserrat text-theme-800">
      <div className="mx-auto w-full max-w-2xl px-4 py-10 md:py-16">
        <header className="text-center mb-8 md:mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-theme-600 font-bold mb-3">Admin · Invitation Links</p>
          <h1 className="font-playball text-5xl md:text-6xl text-theme-900">{GROOM_NAME} & {BRIDE_NAME}</h1>
        </header>

        <form onSubmit={handleGenerate} className="bg-white rounded-3xl border border-theme-100 shadow-[0_20px_50px_-25px_rgba(100,53,69,0.35)] p-5 sm:p-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
            <label className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-theme-500">Prefix</span>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as Prefix)}
                className="w-full rounded-xl border border-theme-200 bg-theme-50/50 px-3 py-3 text-sm focus:outline-none focus:border-theme-500 focus:ring-2 focus:ring-theme-200"
              >
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-theme-500">Guest Name</span>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Sanjaya"
                className="w-full rounded-xl border border-theme-200 bg-theme-50/50 px-3 py-3 text-sm focus:outline-none focus:border-theme-500 focus:ring-2 focus:ring-theme-200"
              />
            </label>
          </div>

          <p className="text-xs text-theme-500 min-h-[1rem]">
            {previewName ? (
              <>Greeting preview: <span className="font-semibold text-theme-800">Dear {previewName} ❤️</span></>
            ) : error ? (
              <span className="text-theme-700">{error}</span>
            ) : (
              "Enter a name to see the greeting."
            )}
          </p>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-theme-700 hover:bg-theme-800 text-white py-3.5 text-xs font-bold uppercase tracking-[0.25em] transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            Generate Link
          </button>
        </form>

        <section className="mt-6 bg-white rounded-3xl border border-theme-100 shadow-[0_20px_50px_-25px_rgba(100,53,69,0.35)] p-5 sm:p-8 space-y-5">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-theme-500">Generated Link</p>
            {generated ? (
              <a
                href={generated.link}
                target="_blank"
                rel="noreferrer"
                className="block break-all rounded-xl bg-theme-50 border border-theme-100 px-3 py-3 text-sm text-theme-800 underline underline-offset-2 hover:text-theme-600"
              >
                {generated.link}
              </a>
            ) : (
              <p className="rounded-xl bg-theme-50 border border-dashed border-theme-200 px-3 py-3 text-sm text-theme-400">
                Click “Generate Link” to create a personalised invitation.
              </p>
            )}
          </div>

          {generated && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-theme-500">Message Preview</p>
              <pre className="whitespace-pre-wrap break-words rounded-xl bg-theme-50 border border-theme-100 px-4 py-4 text-sm leading-relaxed font-montserrat text-theme-700">
                {generated.message}
              </pre>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.link, "Link copied!")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-theme-300 text-theme-800 hover:bg-theme-50 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.message, "Message copied!")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender-600 hover:bg-lavender-700 text-white py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-lavender-600"
            >
              <MessageCircle className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>
        </section>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-theme-900 text-white px-5 py-2.5 text-xs font-semibold shadow-lg transition-all duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
      >
        <Check className="w-4 h-4" />
        {toast}
      </div>
    </main>
  );
}
