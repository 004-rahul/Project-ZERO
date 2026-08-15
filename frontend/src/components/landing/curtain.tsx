"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Load curtain (Design Bible §15).
 *
 * Deliberately short and deliberately capped. A loading sequence is only
 * legitimate while the page genuinely is not ready — the moment it becomes a
 * mandatory wait for an animation to finish, it is costing the visitor time to
 * flatter the site, which is the opposite of premium.
 *
 *  - hard cap of 900ms, whatever else happens
 *  - skipped entirely on repeat views within a session
 *  - skipped entirely under prefers-reduced-motion
 *  - it lifts as a wipe, so the hero is already moving underneath it
 */
export function Curtain() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem("pz-curtain") === "seen") return;
    sessionStorage.setItem("pz-curtain", "seen");
    setOpen(true);
    const t = setTimeout(() => setOpen(false), 900);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zone-header"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: DUR.componentSlow, ease: EASE_OUT }}
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.component, ease: EASE_OUT }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
                Z
              </span>
              <span className="text-md font-bold tracking-tight text-on-dark">Project Zero</span>
            </motion.div>
            <span className="relative block h-px w-40 overflow-hidden bg-white/12">
              <motion.span
                className="absolute inset-y-0 left-0 block bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.72, ease: EASE_OUT }}
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
