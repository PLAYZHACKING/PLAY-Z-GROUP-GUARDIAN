import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLatest?: boolean;
}

export function ChatMessage({ role, content, isLatest }: ChatMessageProps) {
  const isBot = role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-4 p-4 md:p-6 mb-4 rounded-2xl border",
        isBot 
          ? "bg-secondary/40 border-primary/20 self-start mr-auto" 
          : "bg-primary/10 border-primary/30 self-end ml-auto flex-row-reverse"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-2 ring-offset-2 ring-offset-background",
        isBot ? "bg-gradient-to-br from-indigo-500 to-purple-600 ring-indigo-500/50" : "bg-gradient-to-br from-emerald-400 to-cyan-500 ring-emerald-400/50"
      )}>
        {isBot ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
      </div>

      <div className={cn(
        "flex-1 min-w-0 prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-headings:text-primary-foreground",
        !isBot && "text-right"
      )}>
        <div className={cn("font-bold text-xs mb-2 opacity-50 uppercase tracking-widest", !isBot && "text-right")}>
          {isBot ? "Group Guardian AI" : "You"}
        </div>
        {isBot ? (
          <div className="text-sm md:text-base text-gray-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm md:text-base text-white">{content}</p>
        )}
      </div>
    </motion.div>
  );
}
