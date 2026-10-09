const isDevelopment = import.meta.env.DEV

function requireDevelopmentMocks() {
  if (!isDevelopment) {
    throw new Error('Admin API chưa được cấu hình cho môi trường production.')
  }
}

export async function listAdminUsers() {
  requireDevelopmentMocks()
  const { mockAdminUsers } = await import('../data/mockAdminUsers.js')
  return mockAdminUsers.map((user) => ({ ...user }))
}

export async function listAdminListings() {
  requireDevelopmentMocks()
  const { mockAdminListings, LISTING_TYPE_LABELS, MODERATION_STATUS_LABELS } = await import('../data/mockAdminListings.js')
  return {
    listings: mockAdminListings.map((listing) => ({ ...listing })),
    typeLabels: { ...LISTING_TYPE_LABELS },
    moderationLabels: { ...MODERATION_STATUS_LABELS },
  }
}
