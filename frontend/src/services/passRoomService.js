import { createListingApi } from './listingApi.js'

const api = createListingApi('/api/pass-phong')

export const listPassRooms = api.list
export const getPassRoom = api.get
export const createPassRoom = api.create
