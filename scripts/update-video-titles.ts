import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Load from .env.local if .dev.vars not loaded
if (!process.env.PAYLOAD_SECRET) {
  const { config: dotenvConfig } = await import('dotenv')
  dotenvConfig({ path: '.env.local' })
}

// Parse TikTok title to extract clean title and tags
function parseTikTokTitle(fullTitle: string): { displayTitle: string; tags: string[] } {
  // Find the first hashtag
  const hashtagIndex = fullTitle.indexOf('#')
  
  if (hashtagIndex === -1) {
    // No hashtags, use full title
    return { displayTitle: fullTitle.trim(), tags: [] }
  }
  
  // Get the clean title (before first hashtag)
  let displayTitle = fullTitle.substring(0, hashtagIndex).trim()
  
  // If the display title is empty or just emojis, use a fallback
  const textOnly = displayTitle.replace(/[\p{Emoji}]/gu, '').trim()
  if (textOnly.length < 3) {
    displayTitle = 'TikTok Prank Video'
  }
  
  // Extract all hashtags
  const hashtagPart = fullTitle.substring(hashtagIndex)
  const tagMatches = hashtagPart.match(/#[\w]+/g) || []
  
  // Clean up tags (remove # and convert to lowercase)
  const tags = tagMatches
    .map(tag => tag.substring(1).toLowerCase())
    .filter(tag => tag.length >= 2 && tag.length <= 30) // Filter out too short/long tags
    .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
    .slice(0, 10) // Limit to 10 tags
  
  return { displayTitle, tags }
}

async function updateExistingVideos() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Get all videos
  const { docs: videos } = await payload.find({
    collection: 'videos',
    limit: 1000,
  })

  console.log(`Found ${videos.length} videos to update`)

  for (const video of videos) {
    try {
      let displayTitle: string
      let tags: string[] = []

      if (video.platform === 'tiktok') {
        const parsed = parseTikTokTitle(video.title)
        displayTitle = parsed.displayTitle
        tags = parsed.tags
      } else {
        displayTitle = video.title
        tags = []
      }

      // Update the video
      await payload.update({
        collection: 'videos',
        id: video.id,
        data: {
          displayTitle,
          tags,
        },
      })

      console.log(`✓ Updated: ${displayTitle} (${tags.length} tags)`)
    } catch (error) {
      console.error(`✗ Failed to update ${video.id}:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('\nDone!')
  process.exit(0)
}

updateExistingVideos()
