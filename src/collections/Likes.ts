import type { CollectionConfig } from 'payload'

export const Likes: CollectionConfig = {
  slug: 'likes',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['video', 'user', 'createdAt'],
    group: 'Engagement',
  },
  access: {
    // Anyone can read likes
    read: () => true,
    // Only authenticated users can create
    create: ({ req: { user } }) => Boolean(user),
    // Users can only delete their own likes
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: { equals: user.id },
      }
    },
    // No updates allowed
    update: () => false,
  },
  fields: [
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'videos',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-set user on create
        if (operation === 'create' && req.user && !data.user) {
          data.user = req.user.id
        }
        return data
      },
    ],
  },
}
