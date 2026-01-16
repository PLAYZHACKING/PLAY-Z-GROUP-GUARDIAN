import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Send, ShieldCheck, Zap, ExternalLink, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const chatMutation = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    chatMutation.mutate(input, {
      onSuccess: (data) => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: typeof data.response === 'string' 
            ? data.response 
            : JSON.stringify(data.response)
        };
        setMessages(prev => [...prev, botMessage]);
        
        if (data.Join) {
          setJoinLink(data.Join);
        }
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: error.message || "Failed to reach Group Guardian AI."
        });
        // Remove the user message if it failed? Or keep it and show error state?
        // For now we keep it but toast the error.
      }
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0e] to-black text-foreground flex flex-col font-sans selection:bg-primary/20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-md opacity-50 rounded-full animate-pulse"></div>
              <ShieldCheck className="w-8 h-8 text-primary relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                P-Z GROUP GUARDIAN
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono border border-primary/30 uppercase">
                  Beta
                </span>
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Online & Secure
              </p>
            </div>
          </div>

          {joinLink && (
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              href={joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              Join Community
              <ExternalLink className="w-3 h-3 ml-1" />
            </motion.a>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 relative">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
              <ShieldCheck className="w-16 h-16 text-primary relative z-10" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">
                How can I protect you?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I am P-Z AI, the intelligence behind PLAY-Z GROUP GUARDIAN. Ask me anything or request assistance.
              </p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg"
            >
              {[
                "Who created you?",
                "What are your capabilities?", 
                "Scan this group for threats",
                "Help me secure my account"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(suggestion);
                    // Slight delay to allow state update before submit if we wanted to auto-submit
                    // But for UX, let user review the text first or focus input
                    const inputEl = document.querySelector('input');
                    inputEl?.focus();
                  }}
                  className="px-4 py-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-white/5 hover:border-primary/30 transition-all text-sm text-left text-muted-foreground hover:text-white flex items-center justify-between group"
                >
                  {suggestion}
                  <Terminal className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6 pb-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  role={msg.role} 
                  content={msg.content} 
                  isLatest={msg.id === messages[messages.length - 1].id}
                />
              ))}
              {chatMutation.isPending && (
                <div className="self-start">
                  <TypingIndicator />
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 z-50 p-4 md:p-6 glass-panel border-t border-white/10 mt-auto">
        <div className="max-w-5xl mx-auto relative">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-20 group-focus-within:opacity-50 transition-opacity blur"></div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Group Guardian..."
                disabled={chatMutation.isPending}
                className="relative w-full bg-black/50 border-white/10 text-white placeholder:text-white/30 h-14 pl-6 pr-12 rounded-2xl focus:ring-0 focus:border-transparent text-base md:text-lg shadow-inner"
              />
            </div>

            <Button
              type="submit"
              disabled={!input.trim() || chatMutation.isPending}
              size="icon"
              className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-purple-700 hover:from-primary/90 hover:to-purple-700/90 text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {chatMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground/50 font-mono uppercase tracking-widest">
              Secured by P-Z Encryption Protocol
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
