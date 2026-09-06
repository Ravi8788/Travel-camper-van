"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const stages = ["Booked", "Confirmed", "Pickup", "Active Rental", "Return", "Completed"];

export function BookingTimeline({ current = 1 }: { current?: number }) {
  return <div className="rounded-xl border border-sand-200 bg-sand-50 p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Trip status</p><h3 className="mt-1 font-display text-xl font-bold">Your journey is taking shape</h3></div><span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent-700">{stages[current]}</span></div><div className="flex items-start"><div className="absolute hidden" aria-hidden="true" /><div className="flex w-full justify-between">{stages.map((stage, index) => { const complete = index <= current; return <div key={stage} className="relative flex flex-1 flex-col items-center text-center"><div className="absolute left-1/2 top-4 -z-0 h-0.5 w-full bg-sand-200 first:hidden" /><motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.06 }} className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${complete ? "border-accent-500 bg-accent-500 text-white" : "border-sand-300 bg-sand-50 text-sand-400"}`}>{complete ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}</motion.div><span className={`mt-3 hidden max-w-20 text-[10px] font-semibold sm:block ${complete ? "text-ink" : "text-sand-400"}`}>{stage}</span></div>; })}</div></div></div>;
}
