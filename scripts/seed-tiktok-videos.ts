import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Load from .env.local if .dev.vars not loaded
if (!process.env.PAYLOAD_SECRET) {
  const { config: dotenvConfig } = await import('dotenv')
  dotenvConfig({ path: '.env.local' })
}

const TIKTOK_PRANK_VIDEOS = [
  'https://www.tiktok.com/@funny.prankusa19/video/7505792117457849643', // Scare prank 1.5M views
  'https://www.tiktok.com/@vakzxzxmq3/video/7567323205694721294', // Fun with yahia 373K
  'https://www.tiktok.com/@picazzy17/video/7564464214140669191', // Cat Cake Prank 498K
  'https://www.tiktok.com/@zydecljj7mi/video/7576564274772954423', // Scare prank 117K
  'https://www.tiktok.com/@cdmgjhy1i7/video/7567137398748876046', // Unexpected prank 97.9K
  'https://www.tiktok.com/@_mr.funn/video/7537732204479253774', // Bushman prank 42.7K
  'https://www.tiktok.com/@indayjoannaaa/video/7568265283337473287', // Pranking wife 38K
  'https://www.tiktok.com/@am_immortal1/video/7556372363550510337', // Hilarious pranks 19.5K
  'https://www.tiktok.com/@hanbygangfamily/video/7522433248148851974', // Daily pranks 18K
  'https://www.tiktok.com/@funny.prankusa19/video/7513211215267613998', // Air horn prank 15K
]

async function seedTikTokVideos() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Get admin user
  const { docs: users } = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
  })

  if (users.length === 0) {
    console.error('No admin user found!')
    process.exit(1)
  }

  const adminUser = users[0]
  console.log(`Using admin user: ${adminUser.email}`)

  for (const url of TIKTOK_PRANK_VIDEOS) {
    try {
      console.log(`\nAdding: ${url}`)
      
      // Check if video already exists
      const { docs: existing } = await payload.find({
        collection: 'videos',
        where: { sourceUrl: { equals: url } },
        limit: 1,
      })

      if (existing.length > 0) {
        console.log('  ↳ Already exists, skipping')
        continue
      }

      // Create video (oEmbed data will be auto-fetched by the beforeChange hook)
      const video = await payload.create({
        collection: 'videos',
        data: {
          sourceUrl: url,
          status: 'approved',
          submittedBy: adminUser.id,
        } as any, // Type assertion needed because other fields are auto-populated
      })

      console.log(`  ✓ Added: ${video.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to add ${url}:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('\nDone!')
  process.exit(0)
}

seedTikTokVideos()
