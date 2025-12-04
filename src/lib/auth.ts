import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { withCloudflare } from 'better-auth-cloudflare'
import { getDb } from '@/db'
import { authUsers, authSessions, authAccounts, authVerifications } from '@/db/schema'

// Create schema for drizzle adapter - map model names to our custom table schemas
const drizzleSchema = {
  // Map singular model names (what better-auth expects) to our auth_ prefixed tables
  user: authUsers,
  session: authSessions,
  account: authAccounts,
  verification: authVerifications,
}

// Shared auth options (used by both runtime and static exports)
const authOptions = {
  secret: process.env.BETTER_AUTH_SECRET || process.env.PAYLOAD_SECRET || 'development-secret-change-me',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  trustedOrigins: [
    'http://localhost:3000',
    'https://pranks.hph.workers.dev',
    'https://pranks-production.hph.workers.dev',
    'https://pranks.com',
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
}

// Async auth builder for runtime (uses Cloudflare context)
function authBuilder() {
  const db = getDb()
  return betterAuth(
    withCloudflare(
      {
        d1: {
          db,
          options: { 
            usePlural: false,
            schema: drizzleSchema,
          },
        },
        // Disable geolocation and IP detection to avoid needing Cloudflare context
        autoDetectIpAddress: false,
        geolocationTracking: false,
      },
      authOptions
    )
  )
}

// Singleton pattern for runtime auth instance
let authInstance: ReturnType<typeof authBuilder> | null = null

export function initAuth() {
  if (!authInstance) {
    authInstance = authBuilder()
  }
  return authInstance
}

// Static auth export for CLI schema generation (npx @better-auth/cli generate)
// This uses a mock database that satisfies the type requirements
export const auth = betterAuth({
  database: drizzleAdapter(null as any, {
    provider: 'sqlite',
    schema: drizzleSchema,
    usePlural: false,
  }),
  ...authOptions,
})

export type Auth = typeof auth
