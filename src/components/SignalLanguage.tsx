import { motion } from "motion/react";

const signals = [
  "FREQUENCY: ABUNDANCE",
  "REWRITE THE CODE",
  "MATCH THE VIBRATION",
  "WATCH ME CREATE",
  "ARCHITECT OF OVERFLOW",
  "CODE ACCEPTED"
];

export function SignalLanguage() {
  return (
    <section id="signals" className="scroll-mt-24 py-16 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle background pulses */}
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-[0.03] bg-[#009DFF] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-[0.02] bg-[#FF8800] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 relative z-10 items-center justify-center text-center">
        {signals.map((signal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center group"
          >
            <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 group-hover:to-white/80 transition-all duration-700 select-none cursor-default drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_25px_rgba(0,157,255,0.2)]">
              {signal}
            </h2>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
