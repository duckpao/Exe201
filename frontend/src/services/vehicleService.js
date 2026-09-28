import { createListingApi } from './listingApi.js'

const api = createListingApi('/api/transport')

export const listVehicles = api.list
export const getVehicle = api.get
export const createVehicle = api.create
