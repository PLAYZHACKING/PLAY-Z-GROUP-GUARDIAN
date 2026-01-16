import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 p-4 rounded-2xl bg-secondary/40 border border-primary/20 w-fit mb-4 ml-0"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-medium">Computing response...</span>
    </motion.div>
  );
}
