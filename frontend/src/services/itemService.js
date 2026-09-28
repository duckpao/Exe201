import { createListingApi } from './listingApi.js'

const api = createListingApi('/api/pass-do')

export const listItems = api.list
export const getItem = api.get
export const createItem = api.create
