import { createListingApi } from './listingApi.js'

const api = createListingApi('/api/roommates')

export const listRoommates = api.list
export const getRoommate = api.get
export const createRoommate = api.create
