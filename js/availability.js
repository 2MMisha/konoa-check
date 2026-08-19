// חישוב זמינות ציוד: כמות במלאי פחות מה שכבר מוזמן (approved) בטווח תאריכים חופף.

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// bookings: מערך מ-data/bookings.json (רק סטטוס approved נמצא שם)
function reservedQtyForItem(bookings, itemId, pickupISO, returnISO) {
  const start = new Date(pickupISO).getTime();
  const end = new Date(returnISO).getTime();
  if (isNaN(start) || isNaN(end)) return 0;

  let total = 0;
  for (const b of bookings) {
    const bStart = new Date(b.pickup).getTime();
    const bEnd = new Date(b.return).getTime();
    if (!rangesOverlap(start, end, bStart, bEnd)) continue;
    const line = (b.items || []).find(i => i.id === itemId);
    if (line) total += line.qty || 1;
  }
  return total;
}

function availableQtyForItem(inventory, bookings, itemId, pickupISO, returnISO) {
  const total = inventory[itemId] ?? 0;
  const reserved = reservedQtyForItem(bookings, itemId, pickupISO, returnISO);
  return Math.max(0, total - reserved);
}
