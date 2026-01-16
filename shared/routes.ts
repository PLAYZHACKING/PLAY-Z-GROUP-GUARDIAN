import { z } from 'zod';

export const api = {
  chat: {
    generate: {
      method: 'GET' as const,
      path: '/api/generate',
      input: z.object({
        q: z.string().min(1, "Query parameter 'q' is required")
      }),
      responses: {
        200: z.object({
          Join: z.string(),
          response: z.any(),
          status: z.number(),
          successful: z.string()
        }),
        400: z.object({
          error: z.string(),
          status: z.number(),
          successful: z.string()
        }),
        500: z.object({
          error: z.string(),
          raw: z.string().optional(),
          status: z.number(),
          successful: z.string()
        })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
          }
