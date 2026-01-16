import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useChat() {
  return useMutation({
    mutationFn: async (message: string) => {
      // Construct URL manually since it's a GET request with query params
      // using the exact path from api definition
      const url = `${api.chat.generate.path}?q=${encodeURIComponent(message)}`;
      
      const res = await fetch(url, {
        method: api.chat.generate.method,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate response');
      }

      // Validate response with Zod schema from shared routes
      const data = await res.json();
      return api.chat.generate.responses[200].parse(data);
    }
  });
        }
    
