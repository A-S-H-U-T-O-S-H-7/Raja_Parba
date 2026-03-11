const DEFAULT_PREMIUM_BLOCKS = [
  { id: 'A', name: 'Block A', maxRows: 8, maxPairsPerRow: 7, price: 1200, isActive: true, type: 'premium' },
  { id: 'B', name: 'Block B', maxRows: 8, maxPairsPerRow: 7, price: 1200, isActive: true, type: 'premium' }
];

const DEFAULT_REGULAR_BLOCKS = [
  { id: 'C', name: 'Block C', maxRows: 25, maxSeatsPerRow: 15, price: 600, isActive: true, type: 'regular' },
  { id: 'D', name: 'Block D', maxRows: 25, maxSeatsPerRow: 15, price: 400, isActive: true, type: 'regular' }
];

const sanitizeBlockId = (value = '') =>
  String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);

const normalizeBlock = (block, type, fallbackIndex = 0) => {
  const defaultBlock = (type === 'premium' ? DEFAULT_PREMIUM_BLOCKS : DEFAULT_REGULAR_BLOCKS)[fallbackIndex];
  const id = sanitizeBlockId(block?.id || defaultBlock?.id || `B${fallbackIndex + 1}`);
  const isPremium = type === 'premium';
  const normalized = {
    ...defaultBlock,
    ...block,
    id,
    type,
    name: block?.name || defaultBlock?.name || `Block ${id}`,
    maxRows: Math.max(1, Number(block?.maxRows || defaultBlock?.maxRows || 1)),
    price: Number(block?.price ?? defaultBlock?.price ?? 0) || 0,
    isActive: block?.isActive !== undefined ? block.isActive : block?.active !== undefined ? block.active : true
  };

  if (isPremium) {
    normalized.maxPairsPerRow = Math.max(1, Number(block?.maxPairsPerRow || defaultBlock?.maxPairsPerRow || 1));
    delete normalized.maxSeatsPerRow;
  } else {
    normalized.maxSeatsPerRow = Math.max(1, Number(block?.maxSeatsPerRow || defaultBlock?.maxSeatsPerRow || 1));
    delete normalized.maxPairsPerRow;
  }

  return normalized;
};

export const normalizeShowSettings = (settings = {}) => {
  const seatLayout = settings?.seatLayout || {};
  const premiumBlocks = (seatLayout.premiumBlocks?.length ? seatLayout.premiumBlocks : DEFAULT_PREMIUM_BLOCKS)
    .map((block, index) => normalizeBlock(block, 'premium', index));
  const regularBlocks = (seatLayout.regularBlocks?.length ? seatLayout.regularBlocks : DEFAULT_REGULAR_BLOCKS)
    .map((block, index) => normalizeBlock(block, 'regular', index));

  return {
    ...settings,
    eventDates: {
      startDate: '',
      endDate: '',
      isActive: false,
      availableDays: 5,
      ...settings?.eventDates
    },
    shows: Array.isArray(settings?.shows) ? settings.shows : [],
    seatLayout: {
      premiumBlocks,
      regularBlocks
    }
  };
};

export const getAllShowBlocks = (showSettings, options = {}) => {
  const { includeInactive = true } = options;
  const normalized = normalizeShowSettings(showSettings);
  const blocks = [
    ...normalized.seatLayout.premiumBlocks,
    ...normalized.seatLayout.regularBlocks
  ];

  return includeInactive ? blocks : blocks.filter((block) => block.isActive);
};

export const getShowBlockMap = (showSettings, options = {}) =>
  getAllShowBlocks(showSettings, options).reduce((acc, block) => {
    acc[block.id] = block;
    return acc;
  }, {});

export const getSeatBlockId = (seatId) => String(seatId || '').split('-')[0];

export const getSeatBlock = (showSettings, seatId) => {
  const blockId = getSeatBlockId(seatId);
  return getShowBlockMap(showSettings)[blockId] || null;
};

export const generateShowSeatLayout = (showSettings, pricingByBlock = {}) => {
  const blocks = getAllShowBlocks(showSettings, { includeInactive: false });
  const seats = [];

  blocks.forEach((block) => {
    const blockPrice = Number(pricingByBlock?.[block.id]?.price ?? block.price ?? 0) || 0;

    if (block.type === 'premium') {
      for (let row = 1; row <= block.maxRows; row++) {
        const letters = Array.from({ length: block.maxPairsPerRow }, (_, index) => String.fromCharCode(65 + index));
        letters.forEach((letter) => {
          [1, 2].forEach((position) => {
            seats.push({
              id: `${block.id}-R${row}-${letter}${position}`,
              row,
              seat: `${letter}${position}`,
              section: block.id,
              type: 'VIP',
              blockType: 'premium',
              price: blockPrice,
              displayName: `${letter}${position}`,
              pairLetter: letter,
              pairPosition: position,
              status: 'available',
              blockName: block.name
            });
          });
        });
      }
      return;
    }

    for (let row = 1; row <= block.maxRows; row++) {
      for (let seat = 1; seat <= block.maxSeatsPerRow; seat++) {
        seats.push({
          id: `${block.id}-R${row}-S${seat}`,
          row,
          seat,
          section: block.id,
          type: 'REGULAR',
          blockType: 'regular',
          price: blockPrice,
          displayName: `${seat}`,
          status: 'available',
          blockName: block.name
        });
      }
    }
  });

  return seats;
};

export const normalizeShowPricing = (pricing = {}, showSettings = null) => {
  const blocks = getAllShowBlocks(showSettings, { includeInactive: true });
  const legacySeatTypes = pricing?.seatTypes || {};
  const nextBlockPrices = { ...(pricing?.blockPrices || {}) };

  blocks.forEach((block) => {
    const legacyKey = `block${block.id}`;
    const legacyRawPrice = legacySeatTypes?.[legacyKey]?.price ?? legacySeatTypes?.[block.id]?.price;
    const currentRawPrice = nextBlockPrices?.[block.id]?.price;
    const resolvedPrice =
      currentRawPrice !== undefined && currentRawPrice !== null
        ? Number(currentRawPrice)
        : legacyRawPrice !== undefined && legacyRawPrice !== null
          ? Number(legacyRawPrice)
          : Number(block.price ?? 0);

    nextBlockPrices[block.id] = {
      price: Number.isNaN(resolvedPrice) ? 0 : resolvedPrice,
      label: block.name,
      blockId: block.id,
      type: block.type,
      isActive: block.isActive
    };
  });

  return {
    ...pricing,
    blockPrices: nextBlockPrices,
    earlyBirdDiscounts: pricing?.earlyBirdDiscounts || [],
    bulkBookingDiscounts: pricing?.bulkBookingDiscounts || []
  };
};

export const getBlockPrice = ({ showPricing, showSettings, seatId, fallbackPrice = 0 }) => {
  const block = getSeatBlock(showSettings, seatId);
  const blockId = block?.id || getSeatBlockId(seatId);
  const price = Number(showPricing?.blockPrices?.[blockId]?.price);

  if (price > 0) return price;
  if (Number(block?.price) > 0) return Number(block.price);
  return fallbackPrice;
};

export { DEFAULT_PREMIUM_BLOCKS, DEFAULT_REGULAR_BLOCKS, sanitizeBlockId };
