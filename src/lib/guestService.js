import { getGuests as getDistinguishedGuests } from './distinguishedGuestsService';

// Get guests for public display
export const getGuests = async (filters = {}) => {
  return getDistinguishedGuests(filters);
};
