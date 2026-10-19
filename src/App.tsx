import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock } from "lucide-react";
import { getGuestNameFromPath, RSVP_SCRIPT_URL } from "./weddingConfig";

/**
 * Premium Pastel Wedding Invitation Theme
 * Names: Ashen & Imesha
 * Background: White
 * Accents: Pastel blush, peach, lavender & sky
 */

const backgroundMusic = "/background-music.mp3";

const flowerImage = "/pastel_orchid.png";
const flowerCornerImage = "/pastel_orchid_corner.png";
const heroBackgroundImage = "/hero-bg.jpg";
const brideGroomImage = "/gallery/photo-1.jpg";
const galleryImages = [
  "/gallery/photo-3.jpg",
  "/gallery/photo-2.jpg",
  "/gallery/photo-4.jpg",
  "/gallery/photo-5.jpg",
];
const galleryWideImage = "/gallery/photo-6.jpg";
const MAP_URL = "https://maps.app.goo.gl/sy2T9yPotsEJiuAC7";

type InviteImageProps = React.ComponentProps<"img"> & {
  eager?: boolean;
};

function InviteImage({ eager = false, loading, decoding, ...props }: InviteImageProps) {
  return (
    <img
      loading={loading ?? (eager ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      {...props}
    />
  );
}

function MandalaFrame({ minimal = false }: { minimal?: boolean }) {
  return (
    <div className="mandala-frame pointer-events-none fixed inset-0 z-[12] overflow-hidden" aria-hidden="true">
      <div className="mandala-corner mandala-corner-tr">
        <InviteImage src={flowerImage} alt="" className="mandala-art" eager />
      </div>
      {!minimal && (
        <>
          <div className="mandala-corner mandala-corner-bl mandala-mobile-hidden">
            <InviteImage src={flowerImage} alt="" className="mandala-art" />
          </div>
          <div className="mandala-corner mandala-corner-tl is-soft mandala-mobile-hidden">
            <InviteImage src={flowerImage} alt="" className="mandala-art" />
          </div>
          <div className="mandala-corner mandala-corner-br is-soft mandala-mobile-hidden">
            <InviteImage src={flowerImage} alt="" className="mandala-art" />
          </div>
        </>
      )}
    </div>
  );
}

function FloatingPetals({ disabled = false }: { disabled?: boolean }) {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<Array<{
    id: number;
    x: number;
    size: number;
    rotation: number;
    duration: number;
    delay: number;
    color: string;
    drift: number;
  }>>([]);

  useEffect(() => {
    if (disabled) {
      setPetals([]);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#f7ccd5", "#faddaf", "#d3bedf", "#c0d1e5", "#FDF5F7"];
    const petalCount = isMobile ? 10 : 18;
    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, [disabled]);

  if (disabled) {
    return null;
  }

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_6px_rgba(247,204,213,0.6)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="drop-shadow-sm"
          >
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

const countdownTints = [
  { card: "bg-theme-50 border-theme-200", inner: "border-theme-300/60", text: "text-theme-700", pill: "text-theme-600 bg-theme-50 border-theme-200", dot: "bg-theme-300" },
  { card: "bg-peach-50 border-peach-200", inner: "border-peach-300/60", text: "text-peach-700", pill: "text-peach-600 bg-peach-50 border-peach-200", dot: "bg-peach-300" },
  { card: "bg-lavender-50 border-lavender-200", inner: "border-lavender-300/60", text: "text-lavender-700", pill: "text-lavender-600 bg-lavender-50 border-lavender-200", dot: "bg-lavender-300" },
  { card: "bg-sky-50 border-sky-200", inner: "border-sky-300/60", text: "text-sky-700", pill: "text-sky-600 bg-sky-50 border-sky-200", dot: "bg-sky-300" },
];

function CountdownTimer() {
  const targetDate = new Date("December 12, 2026 18:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          {/* Ornamental Frame container */}
          <div className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 ${countdownTints[i].card} rounded-t-full shadow-[0_15px_35px_-10px_rgba(67,36,48,0.08)] border flex flex-col items-center justify-center overflow-hidden transition-transform duration-700 group-hover:-translate-y-3`}>
            <div className="absolute top-0 right-0 opacity-[0.03] paper-grain w-full h-full pointer-events-none" />
            <div className={`absolute inset-1.5 sm:inset-2 md:inset-3 border-[0.5px] ${countdownTints[i].inner} rounded-t-full pointer-events-none`} />

            {/* The Number */}
            <span className={`text-2xl sm:text-3xl md:text-5xl font-playball ${countdownTints[i].text} leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110`}>
              {Math.max(0, stat.value).toString().padStart(2, '0')}
            </span>

            {/* The Label */}
            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span className={`text-[5px] sm:text-[6px] md:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] ${countdownTints[i].pill} font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-sm whitespace-nowrap`}>
                {stat.label}
              </span>
            </div>

            {/* Bottom decoration */}
            <div className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${countdownTints[i].dot}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const SCRIPT_URL = RSVP_SCRIPT_URL;

export default function WeddingInvitation() {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName] = useState(() => getGuestNameFromPath(window.location.pathname));
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Form State
  const [rsvpData, setRsvpData] = useState({ name: "", guests: "1", dietary: "" });
  const [wishData, setWishData] = useState({ name: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "rsvp_success" | "wish_success" | "error">(null);

  const handleSubmit = async (formName: "rsvp" | "wish", data: any) => {
    if (!SCRIPT_URL) {
      alert("Please configure RSVP_SCRIPT_URL in src/weddingConfig.ts to enable form submissions.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const params = new URLSearchParams();
      params.append("formName", formName);
      if (guestName) params.append("Invited As", guestName);

      // Explicit mapping of keys to Sheet Headers
      const fieldMapping: Record<string, string> = {
        name: "Name",
        guests: "Guests",
        dietary: "Dietary Notes",
        message: "Message"
      };

      Object.keys(data).forEach(key => {
        const headerName = fieldMapping[key] || key;
        params.append(headerName, data[key]);
      });

      // Using GET with no-cors is the most reliable way to trigger Google Apps Script
      // even if the browser blocks the JSON response due to CORS redirects.
      await fetch(`${SCRIPT_URL}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });

      // Since we use no-cors, we can't read the response, so we assume success if no exception
      setSubmitStatus(`${formName}_success` as any);

      // Reset forms
      if (formName === "rsvp") setRsvpData({ name: "", guests: "1", dietary: "" });
      else setWishData({ name: "", message: "" });

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };


  // True once the guest has started the music; used to resume it whenever the browser pauses it.
  const shouldPlayMusicRef = React.useRef(false);

  const playMusic = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !shouldPlayMusicRef.current || !audio.paused) return;
    audio.play().catch(e => console.log("Audio play failed", e));
  }, []);

  const openInvitation = () => {
    setIsOpened(true);
    shouldPlayMusicRef.current = true;
    playMusic();
  };

  // Keep background music going: mobile browsers pause audio on screen lock / app switch,
  // and short looping clips can occasionally stall at the loop point.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const restartFromBeginning = () => {
      audio.currentTime = 0;
      playMusic();
    };
    const recoverFromError = () => {
      audio.load();
      playMusic();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") playMusic();
    };

    audio.addEventListener("ended", restartFromBeginning);
    audio.addEventListener("stalled", playMusic);
    audio.addEventListener("error", recoverFromError);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", playMusic);
    window.addEventListener("focus", playMusic);
    // Any tap resumes playback if the browser blocked the automatic resume.
    window.addEventListener("pointerdown", playMusic);
    window.addEventListener("touchend", playMusic);

    return () => {
      audio.removeEventListener("ended", restartFromBeginning);
      audio.removeEventListener("stalled", playMusic);
      audio.removeEventListener("error", recoverFromError);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", playMusic);
      window.removeEventListener("focus", playMusic);
      window.removeEventListener("pointerdown", playMusic);
      window.removeEventListener("touchend", playMusic);
    };
  }, [playMusic]);

  useEffect(() => {
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    }).connection;
    const getDeviceMemory = () => (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

    const updatePerformanceMode = () => {
      const constrainedNetwork = Boolean(connection?.saveData) || /2g/.test(connection?.effectiveType ?? "");
      const lowMemory = typeof getDeviceMemory() === "number" && getDeviceMemory()! <= 4;
      const smallScreen = window.innerWidth < 768;
      setIsLowPerformanceMode(motionMedia.matches || constrainedNetwork || lowMemory || smallScreen);
    };

    updatePerformanceMode();
    motionMedia.addEventListener("change", updatePerformanceMode);
    window.addEventListener("resize", updatePerformanceMode);
    connection?.addEventListener?.("change", updatePerformanceMode);

    return () => {
      motionMedia.removeEventListener("change", updatePerformanceMode);
      window.removeEventListener("resize", updatePerformanceMode);
      connection?.removeEventListener?.("change", updatePerformanceMode);
    };
  }, []);

  return (
    <main
      className={`h-[100dvh] w-full bg-[#FFFFFF] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden smooth-mobile-scroll" : "overflow-hidden flex items-center justify-center"
        } relative font-montserrat scroll-smooth`}
    >
      <audio ref={audioRef} src={backgroundMusic} loop preload="auto" />
      {isOpened && (
        <>
          <MandalaFrame minimal={isLowPerformanceMode} />
          <FloatingPetals disabled={isLowPerformanceMode} />
        </>
      )}

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="video-intro-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-theme-100 via-white to-theme-100"
          >


            {/* Content Overlay - Stacked Layout */}
            <div className="relative z-20 h-full w-full flex flex-col items-center bg-white">

              {/* Top Section - Text */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="w-full h-[28vh] md:h-[20vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-lavender-50"
              >
                {/* Decorative Inner Border */}
                <div className="absolute inset-4 border border-lavender-200/70 rounded-[2rem] pointer-events-none" />

                {/* Prominent Floral Accents */}
                <InviteImage src={flowerCornerImage} className="absolute -top-6 -left-6 w-32 md:w-44 opacity-40 md:opacity-20 -rotate-90" alt="" />
                <InviteImage src={flowerCornerImage} className="absolute -top-6 -right-6 w-32 md:w-44 opacity-40 md:opacity-20 rotate-0" alt="" />

                {/* Main Orchid Watermark */}
                <InviteImage src={flowerImage} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 opacity-[0.12] pointer-events-none" alt="" loading="eager" />

                <span className="inline-block px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-lavender-200 text-[8px] md:text-xs uppercase tracking-[0.4em] text-lavender-700 font-bold mb-3 md:mb-4 relative z-10">
                  The Wedding Invitation
                </span>
                <h1 className="font-cinzel text-4xl md:text-6xl text-theme-900 mb-2 tracking-wider relative z-10 drop-shadow-sm">
                  Ashen & Imesha
                </h1>
                <p className="text-sky-600 text-[11px] md:text-base tracking-[0.3em] font-cinzel font-bold relative z-10">2026.12.12</p>
              </motion.div>

              {/* Middle Section - Video (Clean) */}
              <div className="flex-1 w-full relative bg-white overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain"
                  onCanPlay={(e) => (e.currentTarget.playbackRate = 0.8)}
                >
                  <source src="/Use_the_uploaded_202604161807.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Bottom Section - Button */}
              <div className="w-full h-[28vh] md:h-[20vh] flex flex-col items-center justify-center px-4 gap-6 md:gap-8 relative overflow-hidden bg-peach-50">
                {/* Decorative Inner Border */}
                <div className="absolute inset-4 border border-peach-200/80 rounded-[2rem] pointer-events-none" />

                {/* Prominent Floral Accents */}
                <InviteImage src={flowerCornerImage} className="absolute -bottom-8 -left-8 w-32 md:w-44 opacity-40 md:opacity-20 rotate-180" alt="" />
                <InviteImage src={flowerCornerImage} className="absolute -bottom-8 -right-8 w-32 md:w-44 opacity-40 md:opacity-20 rotate-90" alt="" />

                {guestName && (
                  <p className="relative z-10 -mb-2 md:-mb-4 text-center font-cinzel text-xs md:text-sm text-theme-800 tracking-[0.15em]">
                    <span className="block text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-theme-500 font-bold font-montserrat mb-1">Specially for</span>
                    {guestName}
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openInvitation}
                  className="group relative px-12 py-5 rounded-full bg-lavender-600 text-white font-bold uppercase tracking-[0.25em] text-[10px] md:text-xs transition-all duration-500 shadow-xl z-10"
                >
                  <span className="relative z-10">Enter Invitation</span>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  className="flex flex-col items-center z-10"
                >
                  <span className="text-[9px] uppercase tracking-[0.4em] text-theme-800 font-bold bg-theme-100/50 px-4 py-1 rounded-full border border-theme-200/50 shadow-sm">Tap to Open</span>
                </motion.div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            {/* Sticky Return Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-theme-100 text-theme-800 hover:bg-theme-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[8px] uppercase tracking-widest font-bold">Close</div>
              </div>
            </motion.button>

            {/* Hero Section */}
            <section className="h-[100dvh] min-h-[560px] w-full flex items-center justify-center relative overflow-hidden bg-[#FDF5F7]">
              {/* Soft blurred fill so wide screens have no empty sides */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-60 pointer-events-none"
                style={{ backgroundImage: `url(${heroBackgroundImage})` }}
                aria-hidden="true"
              />

              {/* Hero background frame (the image carries its own arch and orchids) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="relative z-10 h-full aspect-[865/1818] max-w-full md:shadow-[0_30px_80px_-20px_rgba(199,116,137,0.35)]"
              >
                <InviteImage
                  src={heroBackgroundImage}
                  alt=""
                  eager
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                />

                <div className="absolute inset-x-[12%] top-[20%] bottom-[16%] flex flex-col items-center justify-between text-center">
                  <div className="flex-1 flex flex-col justify-center">
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-lavender-600 font-bold mb-4 md:mb-6"
                    >
                      The Wedding Of
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="font-playball text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] text-theme-800 leading-[1.1] drop-shadow-sm"
                    >
                      Ashen
                    </motion.h1>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      className="font-playball text-3xl md:text-5xl text-lavender-500 italic font-light my-1 md:my-3 tracking-widest"
                    >
                      &
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                      className="font-playball text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] text-theme-800 leading-[1.1] drop-shadow-sm"
                    >
                      Imesha
                    </motion.h1>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8, duration: 1 }}
                      className="mt-6 md:mt-8"
                    >
                      <span className="inline-block text-[9px] md:text-[12px] uppercase tracking-[0.5em] md:tracking-[0.6em] text-theme-800 font-bold px-5 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#F7CCD5]">
                        Please join us
                      </span>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="flex items-center justify-center gap-4 mb-4 opacity-80 w-full px-6">
                      <div className="h-px w-full bg-peach-200" />
                      <div className="w-1.5 h-1.5 rotate-45 bg-lavender-300 shrink-0" />
                      <div className="h-px w-full bg-sky-200" />
                    </div>
                    <div className="font-cinzel space-y-1">
                      <p className="text-sm md:text-base text-theme-700 tracking-[0.2em] md:tracking-[0.3em] font-bold">2026.12.12</p>
                      <p className="text-[8px] md:text-[9px] text-sky-600 tracking-[0.2em] uppercase font-bold">Ramadia Grand, Moratuwa</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group"
              >
                <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#A85A70] font-bold">Begin</span>
                <div className="w-px h-10 md:h-12 relative overflow-hidden bg-white/60">
                  <motion.div
                    animate={{ y: [-40, 60] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-8 bg-[#C77489]"
                  />
                </div>
              </motion.div>

            </section>

            {/* Wedding Details Section */}
            <section className="cv-auto py-24 md:py-32 w-full flex flex-col items-center px-4 relative">
              <div className="section-floral-overlay absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                {/* Pastel Orchid Corners */}
                <InviteImage src={flowerCornerImage} className="absolute -left-16 -top-16 w-[280px] md:w-[450px] h-auto opacity-40 object-contain -rotate-90" alt="" />
                <InviteImage src={flowerCornerImage} className="absolute -right-16 -top-16 w-[280px] md:w-[450px] h-auto opacity-40 object-contain rotate-0" alt="" />
                <InviteImage src={flowerCornerImage} className="absolute -left-16 -bottom-16 w-[280px] md:w-[450px] h-auto opacity-40 object-contain rotate-180" alt="" />
                <InviteImage src={flowerCornerImage} className="absolute -right-16 -bottom-16 w-[280px] md:w-[450px] h-auto opacity-40 object-contain rotate-90" alt="" />
              </div>

              <div className="max-w-[1000px] w-full flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-8 md:mb-16"
                >
                  <div className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-theme-300 to-transparent mb-8 md:mb-12" />
                  {guestName ? (
                    <div className="text-center max-w-2xl px-4">
                      <span className="text-lavender-500 block text-[8px] md:text-[10px] mb-3 md:mb-4 tracking-[0.8em] uppercase font-bold">Wedding Celebration</span>
                      <p className="text-theme-800 text-[10px] md:text-[14px] tracking-[0.5em] md:tracking-[0.7em] uppercase font-bold">We cordially invite</p>
                      <p className="font-playball text-4xl md:text-6xl text-theme-800 my-4 md:my-6 leading-tight drop-shadow-sm break-words">{guestName}</p>
                      <p className="text-theme-600 text-[10px] md:text-[14px] tracking-[0.5em] md:tracking-[0.7em] uppercase font-bold leading-relaxed">to celebrate our special day with us</p>
                    </div>
                  ) : (
                    <p className="text-theme-800 text-[10px] md:text-[14px] tracking-[0.6em] md:tracking-[0.8em] uppercase font-bold text-center leading-relaxed max-w-2xl px-4">
                      <span className="text-lavender-500 block text-[8px] md:text-[10px] mb-3 md:mb-4 tracking-[0.8em]">Wedding Celebration</span>
                      You are cordially invited to<br className="hidden md:block" />
                      <span className="text-theme-600">celebrate the union of</span>
                    </p>
                  )}
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-theme-300 to-transparent mt-8 md:mt-10" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative mb-10 md:mb-14"
                >
                  <div className="absolute -inset-3 md:-inset-4 rounded-[2rem] bg-peach/60 blur-xl" />
                  <div className="relative bg-white/90 p-2.5 md:p-3 rounded-[2rem] border border-peach-200 shadow-[0_20px_50px_-20px_rgba(100,53,69,0.35)]">
                    <InviteImage
                      src={brideGroomImage}
                      alt="Ashen and Imesha"
                      loading="eager"
                      className="block w-[200px] md:w-[270px] h-auto rounded-[1.6rem] border border-theme-100"
                    />
                  </div>
                </motion.div>

                <div className="relative w-full flex flex-col md:flex-row items-center justify-center md:items-stretch gap-6 md:gap-10 my-12 md:my-20 z-10 px-2 lg:px-8">

                  {/* Groom's Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-sky-50 w-full max-w-[320px] p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(67,36,48,0.1)] border border-sky-200/80 rounded-tl-[100px] rounded-br-[100px] md:rounded-tl-[130px] md:rounded-br-[130px] overflow-hidden group flex flex-col justify-center text-center items-center"
                  >
                    <div className="absolute inset-2 border border-sky-200 rounded-tl-[90px] rounded-br-[90px] md:rounded-tl-[120px] md:rounded-br-[120px] pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.02] paper-grain pointer-events-none" />
                    <div className="relative z-10 space-y-4 py-8 md:py-12">
                      <div className="space-y-2">
                        <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-bold text-theme-400">Beloved son of</p>
                        <p className="text-xs md:text-sm font-cinzel text-theme-600 tracking-wide leading-relaxed">Mr. Janaka<br />& Mrs. Priyanga</p>
                      </div>
                      <h3 className="text-5xl md:text-7xl font-playball text-sky-700 group-hover:scale-110 transition-transform duration-700 pt-6 drop-shadow-sm">Ashen</h3>
                    </div>
                  </motion.div>

                  {/* Vertical Divider / AMPERSAND */}
                  <div className="flex flex-row md:flex-col items-center justify-center gap-4 py-4 md:py-0 relative z-20">
                    <div className="hidden md:block w-px h-32 bg-gradient-to-t from-theme-300 to-transparent" />
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                      className="w-16 h-16 md:w-24 md:h-24 bg-lavender-300 rounded-full flex items-center justify-center shadow-xl shadow-theme-900/20 border-4 border-[#FFFFFF]"
                    >
                      <span className="text-3xl md:text-5xl font-playball text-white md:-mt-1 drop-shadow-md">&</span>
                    </motion.div>
                    <div className="hidden md:block w-px h-32 bg-gradient-to-b from-theme-300 to-transparent" />
                  </div>

                  {/* Bride's Card - Offset structurally on desktop */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-theme-50 w-full max-w-[320px] p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(67,36,48,0.1)] border border-theme-200/80 rounded-tr-[100px] rounded-bl-[100px] md:rounded-tr-[130px] md:rounded-bl-[130px] overflow-hidden group flex flex-col justify-center text-center items-center md:mt-24"
                  >
                    <div className="absolute inset-2 border border-theme-200 rounded-tr-[90px] rounded-bl-[90px] md:rounded-tr-[120px] md:rounded-bl-[120px] pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.02] paper-grain pointer-events-none" />
                    <div className="relative z-10 space-y-4 py-8 md:py-12">
                      <div className="space-y-2">
                        <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-bold text-theme-400">Beloved daughter of</p>
                        <p className="text-xs md:text-sm font-cinzel text-theme-600 tracking-wide leading-relaxed">Mr. Suranjan<br />& Mrs. Surangi</p>
                      </div>
                      <h3 className="text-5xl md:text-7xl font-playball text-theme-800 group-hover:scale-110 transition-transform duration-700 pt-6 drop-shadow-sm">Imesha</h3>
                    </div>
                  </motion.div>
                </div>

                {/* Date & Time Luxury Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center space-y-10 mt-4 md:mt-16 w-full"
                >
                  <div className="w-1.5 h-1.5 rotate-45 bg-theme-300" />

                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 text-center w-full max-w-4xl px-4">
                    <div className="flex flex-col items-center flex-1">
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-sky-500 mb-4 opacity-80" />
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-theme-400 font-bold mb-3">The Date</p>
                      <p className="font-cinzel text-xl md:text-3xl text-theme-900 tracking-widest font-bold whitespace-nowrap">2026.12.12</p>
                      <p className="font-cinzel text-lg md:text-xl text-theme-600 tracking-[0.3em] font-normal mt-2">SATURDAY</p>
                    </div>

                    <div className="hidden md:flex flex-col items-center gap-3">
                      <div className="w-px h-12 bg-theme-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-theme-400" />
                      <div className="w-px h-12 bg-theme-200" />
                    </div>

                    <div className="md:hidden flex flex-row items-center gap-3">
                      <div className="h-px w-10 bg-theme-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-theme-400" />
                      <div className="h-px w-10 bg-theme-200" />
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <Clock className="w-6 h-6 md:w-8 md:h-8 text-lavender-500 mb-4 opacity-80" />
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-theme-400 font-bold mb-3">The Time</p>
                      <p className="font-cinzel text-xl md:text-3xl text-theme-900 tracking-widest font-bold whitespace-nowrap">06:00 PM</p>
                      <p className="font-cinzel text-xs md:text-sm text-theme-600 tracking-[0.2em] mt-3 uppercase">Onwards</p>
                    </div>
                  </div>


                </motion.div>
              </div>
            </section>

            {/* Gallery Section */}
            <section className="cv-auto py-20 md:py-28 w-full flex flex-col items-center px-4 relative bg-lavender-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center mb-10 md:mb-14"
              >
                <span className="text-lavender-600 font-bold uppercase tracking-[0.4em] text-[9px] md:text-[11px] mb-4">Our Moments</span>
                <h2 className="font-playball text-[3rem] md:text-[4.5rem] text-theme-900 leading-none drop-shadow-sm">Forever Begins</h2>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blush" />
                  <span className="w-1.5 h-1.5 rounded-full bg-peach" />
                  <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky" />
                </div>
              </motion.div>

              <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {galleryImages.map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.7 }}
                    className={`relative overflow-hidden bg-white border-[3px] ${["border-theme-200", "border-peach-200", "border-lavender-200", "border-sky-200"][i % 4]} shadow-[0_20px_40px_-20px_rgba(100,53,69,0.25)] ${i % 2 === 0 ? "rounded-t-full rounded-b-2xl" : "rounded-2xl md:mt-12"}`}
                  >
                    <InviteImage src={src} alt="Ashen and Imesha" className="w-full aspect-[2/3] object-cover transition-transform duration-[1.5s] hover:scale-105" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-5xl mt-3 md:mt-5 overflow-hidden rounded-2xl md:rounded-[2rem] border-[3px] border-white ring-1 ring-lavender-200 shadow-[0_20px_40px_-20px_rgba(100,53,69,0.25)]"
              >
                <InviteImage src={galleryWideImage} alt="Ashen and Imesha on the beach" className="w-full h-auto object-cover" />
              </motion.div>
            </section>

            {/* Countdown Section */}
            <section className="cv-auto py-24 md:py-36 bg-peach-50 relative border-y border-theme-100/30 flex flex-col items-center overflow-hidden">
              {/* Premium Background Elements */}
              <div className="absolute inset-0 opacity-[0.03] paper-grain pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-lavender blur-[120px] rounded-full opacity-30 pointer-events-none" />

              <div className="w-full max-w-[1000px] px-4 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative w-full flex flex-col items-center"
                >
                  {/* Watermark text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-playball text-[12vw] md:text-[140px] text-theme-100/50 whitespace-nowrap pointer-events-none z-0 select-none">
                    Forever
                  </div>

                  <div className="flex items-center gap-4 md:gap-8 justify-center relative z-10 w-full mb-6 mt-4 opacity-70">
                    <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-theme-400" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-theme-500 shrink-0" />
                    <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-theme-400" />
                  </div>

                  <h2 className="font-cinzel text-3xl md:text-5xl text-theme-900 mb-8 relative z-10 tracking-widest font-bold drop-shadow-sm px-4 leading-[1.4]">
                    Wait for the <span className="font-playball text-lavender-600 italic lowercase tracking-normal text-4xl md:text-7xl ml-2">magic</span>
                  </h2>

                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-theme-600 font-bold bg-white/80 backdrop-blur-sm px-8 py-3 rounded-full border border-theme-200/50 inline-flex items-center gap-3 shadow-[0_4px_15px_-5px_rgba(67,36,48,0.05)] relative z-10">
                    <span className="w-1 h-1 rounded-full bg-theme-400 animate-pulse" />
                    Counting Down
                    <span className="w-1 h-1 rounded-full bg-theme-400 animate-pulse" />
                  </p>
                </motion.div>

                <CountdownTimer />
              </div>
            </section>

            {/* Venue Location Section */}
            <section className="cv-auto py-24 md:py-36 bg-[#FFFFFF] relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-5 paper-grain pointer-events-none" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach blur-[150px] rounded-full opacity-40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky blur-[150px] rounded-full opacity-30 pointer-events-none" />

              <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8 flex flex-col items-start"
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-px bg-sky-400" />
                        <span className="text-sky-600 font-bold uppercase tracking-[0.4em] text-[9px] md:text-[11px]">The Venue</span>
                      </div>
                      <h2 className="font-playball text-[3.5rem] sm:text-[4rem] md:text-[5.5rem] text-theme-900 leading-[1] drop-shadow-sm ml-[-4px]">
                        Ramadia Grand
                      </h2>
                    </div>

                    <div className="space-y-6 pt-4 relative">
                      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-theme-300 to-transparent" />

                      <div className="pl-8 space-y-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-theme-100 absolute -left-5 top-0">
                          <MapPin className="w-4 h-4 text-sky-500" />
                        </div>
                        <p className="text-lg md:text-xl text-theme-700 font-cinzel font-medium leading-relaxed tracking-wide">
                          Moratuwa.
                        </p>
                      </div>

                      <div className="pl-8 space-y-4 pt-4 text-theme-500 text-sm md:text-base tracking-wide font-light leading-relaxed">
                        We look forward to welcoming you to this beautiful sanctuary to celebrate our special day amidst nature's elegance.
                      </div>
                    </div>

                    <div className="pt-8 w-full md:w-auto">
                      <button
                        onClick={() => window.open(MAP_URL, '_blank', 'noopener,noreferrer')}
                        className="w-full md:w-auto flex items-center justify-center gap-4 bg-sky-600 text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-700/20 transition-all duration-300 group"
                      >
                        <MapPin className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
                        Get Directions
                      </button>
                    </div>
                  </motion.div>

                  {/* Arched Map Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-[450px] mx-auto aspect-[4/5] md:aspect-[3/4] rounded-t-full rounded-b-[2rem] shadow-[0_30px_60px_-15px_rgba(67,36,48,0.15)] border-[12px] border-white bg-sky-100 overflow-hidden group"
                  >
                    <div className="absolute inset-0 border border-sky-200 rounded-t-full rounded-b-[1.5rem] pointer-events-none z-10" />

                    {/* The Maps iframe */}
                    <div className="absolute inset-0 w-full h-full scale-[1.2] group-hover:scale-[1.15] transition-transform duration-[2s]">
                      <iframe
                        src="https://maps.google.com/maps?q=Ramadia%20Grand,%20Moratuwa&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                      />
                    </div>

                    {/* Elegant fade overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent h-32 pointer-events-none z-10 flex items-end justify-center pb-6">
                      <p className="text-[8px] uppercase tracking-widest text-theme-500 font-bold bg-white/90 px-5 py-2 rounded-full shadow-sm backdrop-blur-md inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-400 animate-pulse" />
                        View on Map
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* RSVP Section */}
            <section className="cv-auto py-24 md:py-36 bg-lavender-700 text-white relative overflow-hidden flex flex-col items-center">
              {/* Opulent dark background */}
              <div className="absolute inset-0 opacity-10 paper-grain pointer-events-none" />
              <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] bg-lavender blur-[150px] rounded-full opacity-25 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] max-w-[800px] bg-sky blur-[150px] rounded-full opacity-20 pointer-events-none" />

              <div className="container mx-auto px-4 max-w-2xl text-center relative z-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <p className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] md:tracking-[0.8em] text-peach-200 font-bold mb-6">Will You Join Us?</p>
                  <h2 className="font-playball text-[3.5rem] sm:text-[4rem] md:text-[5.5rem] text-white mb-6 drop-shadow-md">RSVP</h2>
                  <div className="flex items-center gap-4 justify-center w-full mb-8 opacity-60">
                    <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-theme-300" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-white" />
                    <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-theme-300" />
                  </div>
                  <p className="text-theme-300 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-16 tracking-wide font-light">
                    We would be absolutely thrilled to celebrate with you. Kindly respond on or before 25th November 2026.
                  </p>

                  {/* Premium RSVP Form */}
                  <div className="w-full bg-white/5 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_-10px_rgba(67,36,48,0.5)]">
                    <form className="space-y-8 text-left" onSubmit={(e) => { e.preventDefault(); handleSubmit("rsvp", rsvpData); }}>
                      <div className="space-y-3">
                        <label className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-peach-200 ml-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={rsvpData.name}
                          onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-transparent border-b border-white/20 px-2 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-theme-300 transition-colors font-cinzel text-lg md:text-xl tracking-wide"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-peach-200 ml-2">Guests</label>
                        <div className="relative">
                          <select
                            value={rsvpData.guests}
                            onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 px-2 py-3 text-white focus:outline-none focus:border-theme-300 transition-colors font-cinzel text-lg md:text-xl tracking-wide appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-[#432430] text-white">1 Guest (Just Me)</option>
                            <option value="2" className="bg-[#432430] text-white">2 Guests</option>
                            <option value="3" className="bg-[#432430] text-white">3 Guests</option>
                            <option value="4" className="bg-[#432430] text-white">4 Guests</option>
                            <option value="0" className="bg-[#432430] text-theme-300">Regretfully Decline</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-2 h-2 border-r border-b border-theme-300 rotate-45 transform -translate-y-[25%]" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-peach-200 ml-2">Dietary Notes</label>
                        <input
                          type="text"
                          value={rsvpData.dietary}
                          onChange={(e) => setRsvpData({ ...rsvpData, dietary: e.target.value })}
                          placeholder="Allergies, Vegan, etc."
                          className="w-full bg-transparent border-b border-white/20 px-2 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-theme-300 transition-colors font-cinzel text-lg md:text-xl tracking-wide"
                        />
                      </div>

                      <div className="pt-10">
                        <button
                          disabled={isSubmitting}
                          className="w-full bg-peach text-theme-900 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group inline-flex justify-center items-center gap-4"
                        >
                          {isSubmitting ? "Sending..." : (submitStatus === "rsvp_success" ? "Thank You!" : "Send RSVP")}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Wishing Section and Footer Wrapper */}
            <div className="relative bg-[#FFFFFF]">
              <div className="absolute inset-0 opacity-[0.03] paper-grain pointer-events-none" />

              <section className="cv-auto py-24 md:py-36 relative flex flex-col items-center overflow-hidden">
                <InviteImage src={flowerImage} alt="" className="absolute top-0 right-0 w-[40vw] max-w-[500px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <InviteImage src={flowerImage} alt="" className="absolute bottom-16 left-1/2 w-[38vw] max-w-[360px] opacity-20 -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10 w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-peach-100 mb-8 mt-4 shadow-sm border border-peach-200">
                      <Sparkles className="w-8 h-8 text-peach-500" />
                    </div>

                    <h2 className="font-playball text-[3.5rem] sm:text-[4rem] md:text-[5.5rem] text-theme-800 mb-6 drop-shadow-sm leading-none">Best Wishes</h2>
                    <div className="flex items-center justify-center gap-2 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-blush" />
                  <span className="w-1.5 h-1.5 rounded-full bg-peach" />
                  <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky" />
                </div>

                    <p className="text-theme-500 text-sm md:text-lg leading-relaxed max-w-xl mx-auto mb-16 font-light tracking-wide px-4">
                      Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a message, we would be delighted to read it!
                    </p>

                    {/* Premium Wishing Form */}
                    <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 md:p-14 shadow-[0_30px_60px_-15px_rgba(67,36,48,0.05)] border border-lavender-200/80 rounded-tr-[4rem] rounded-bl-[4rem] relative group">
                      {/* Decorative internal lines */}
                      <div className="absolute inset-2 md:inset-4 border-[0.5px] border-lavender-200 rounded-tr-[3.5rem] rounded-bl-[3.5rem] pointer-events-none transition-colors duration-700 group-hover:border-lavender-300" />

                      <form className="space-y-8 text-left relative z-10" onSubmit={(e) => { e.preventDefault(); handleSubmit("wish", wishData); }}>
                        <div className="space-y-3">
                          <label className="text-[7px] md:text-[9px] uppercase tracking-[0.4em] font-bold text-theme-400 ml-2">Your Name</label>
                          <input
                            type="text"
                            required
                            value={wishData.name}
                            onChange={(e) => setWishData({ ...wishData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full bg-theme-50/50 border-b border-theme-200 px-4 py-4 text-theme-900 placeholder:text-theme-300 focus:outline-none focus:border-theme-400 focus:bg-white transition-all font-cinzel text-lg tracking-wide rounded-t-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[7px] md:text-[9px] uppercase tracking-[0.4em] font-bold text-theme-400 ml-2">Your Message</label>
                          <textarea
                            rows={4}
                            required
                            value={wishData.message}
                            onChange={(e) => setWishData({ ...wishData, message: e.target.value })}
                            placeholder="Wishing you a lifetime of happiness..."
                            className="w-full bg-theme-50/50 border-b border-theme-200 px-4 py-4 text-theme-900 placeholder:text-theme-300 focus:outline-none focus:border-theme-400 focus:bg-white transition-all font-cinzel text-lg tracking-wide resize-none rounded-t-lg"
                          />
                        </div>
                        <div className="pt-6 flex justify-center">
                          <button
                            disabled={isSubmitting}
                            className="bg-theme-700 text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-theme-900 hover:shadow-xl hover:shadow-theme-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group/btn inline-flex items-center gap-4"
                          >
                            {isSubmitting ? "Sending..." : (submitStatus === "wish_success" ? "Wishes Sent!" : "Send Wishes")}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="mt-32 md:mt-48 space-y-6 flex flex-col items-center relative w-full">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-playball text-[22vw] md:text-[220px] text-theme-100/40 whitespace-nowrap pointer-events-none z-0 select-none">
                        Thank You
                      </div>
                      <p className="text-[9px] md:text-[11px] uppercase tracking-[0.8em] text-theme-600 font-bold relative z-10 bg-[#FFFFFF] px-6 py-2 rounded-full border border-theme-100/50 shadow-sm">With Love</p>
                      <h3 className="font-playball text-[3.2rem] sm:text-6xl md:text-8xl text-theme-800 relative z-10 drop-shadow-sm px-4 pt-4 pb-2 leading-tight">Ashen & Imesha</h3>

                      <motion.img
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        whileInView={{ opacity: 0.9, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        src={flowerImage}
                        alt=""
                        className="relative z-10 mt-8 w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_12px_24px_rgba(211,190,223,0.6)]"
                      />
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Footer */}
              <footer className="py-12 text-center relative z-10 space-y-3">
                <div className="h-px w-full max-w-3xl mx-auto bg-lavender-200 mb-10" />
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-theme-400 font-bold">
                  © 2026 Ashen & Imesha. <span className="hidden md:inline">|</span><br className="md:hidden block mt-2" /> All rights reserved.
                </p>
                <p className="text-theme-600 text-xs mt-2 font-sans tracking-wider px-4">Want a beautiful wedding website like this? Create yours with <a target="_blank" rel="noreferrer" className="text-theme-900 font-semibold hover:text-theme-500 underline underline-offset-2 transition-colors" href="https://wa.me/94707819074">invitemint</a></p>

              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-very {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        .animate-spin-slow-very {
          animation: spin-slow-very linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #FFFFFF;
        }
        ::-webkit-scrollbar-thumb {
          background: #DC8FA2;
          border-radius: 10px;
        }
      `}} />
    </main>
  );
}
