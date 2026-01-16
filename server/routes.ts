import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { createHash } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.chat.generate.path, async (req, res) => {
    const rawMessage = req.query.q as string;

    if (!rawMessage) {
      return res.status(400).json({
        error: "Missing query parameter 'q'",
        status: 400,
        successful: "failed"
      });
    }

    const timestamp = Date.now();
    
    // Original System Prompt with owner/creator details
    const SYSTEM_PROMPT = `
You are P-Z AI, the intelligence behind PLAY-Z GROUP GUARDIAN 🛡️.

If asked who you are or who created you, reply ONLY:
"I'm P-Z AI, the intelligence behind PLAY-Z GROUP GUARDIAN 🛡️. Created by @PLAYZ_HACKING. I’m here to protect, manage, and assist this group automatically."

Rules:
- DO NOT wrap your response in markdown code blocks like \`\`\`json.
- Return your response as a raw JSON object.
- Use emojis 🛡️✨
- Model: P-Z AI 1.0 (Advanced Intelligence)
`;

    // Replicating the SHA-256 logic from the provided code
    const sign = createHash("sha256")
      .update(`${timestamp}:${rawMessage}:`)
      .digest("hex");

    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/537.36",
    ];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const data = {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: rawMessage }
      ],
      time: timestamp,
      pass: null,
      sign: sign,
    };

    const headers = {
      "User-Agent": userAgent,
      "Content-Type": "application/json",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.google.com/",
      "Origin": "https://api.ashlynn-repo.tech/",
      "Connection": "keep-alive",
    };

    try {
      // Short timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // reduced to 10s

      const response = await fetch("https://chat4.free2gpt.com/api/generate", {
        method: "POST",
        headers: {
          ...headers,
          "Origin": "https://chat4.free2gpt.com",
          "Referer": "https://chat4.free2gpt.com/",
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      // If the response is not ok, throw error early
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const textResponse = await response.text();
      
      let ashlynn;
      try {
        const jsonResponse = JSON.parse(textResponse);
        
        let ai = jsonResponse?.choices?.[0]?.message;

        // Step 1: Handle if the AI response is an object with content (OpenAI style)
        if (ai && typeof ai === "object" && ai.content) {
          ai = ai.content;
        }

        const parseIfString = (val: any): any => {
          if (typeof val !== "string") return val;
          
          let cleaned = val.trim();
          // Remove ALL markdown code blocks, even nested ones or multiple ones
          cleaned = cleaned.replace(/```(?:json)?\n?([\s\S]*?)```/g, "$1").trim();
          
          if ((cleaned.startsWith("{") && cleaned.endsWith("}")) || (cleaned.startsWith("[") && cleaned.endsWith("]"))) {
            try {
              return JSON.parse(cleaned);
            } catch (e) {
              return cleaned;
            }
          }
          return cleaned;
        };

        // Deep parse ashlynn
        let processed = parseIfString(ai || textResponse);
        
        // If the processed result is an object, check if any of its string properties are also JSON
        if (processed && typeof processed === "object") {
          for (const key in processed) {
            processed[key] = parseIfString(processed[key]);
          }
        }

        ashlynn = processed;
      } catch (error) {
        ashlynn = textResponse;
      }

      return res.status(200).json({
        "Join": "https://t.me/Playz_hacking",
        "response": ashlynn,
        "status": 200,
        "successful": "success"
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return res.status(500).json({
        "Join": "https://t.me/Playz_hacking",
        "response": errorMessage,
        "status": 500,
        "successful": "failed"
      });
    }
  });

  return httpServer;
}
