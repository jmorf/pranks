import { drizzle } from 'drizzle-orm/d1'
import { schema } from './schema'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export function getDb() {
  const { env } = getCloudflareContext()
  return drizzle(env.D1, { schema })
}

export type Db = ReturnType<typeof getDb>
