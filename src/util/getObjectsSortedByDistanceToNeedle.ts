function getSquareDistance(x1: number, y1: number, x2: number, y2: number) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

/**
 * Interface is compatible with all `Marker` entities.
 */
export interface Pos2D {
  posX: number;
  posY: number;
}

/**
 * @returns returns haystack sorted by distance to needle. Empty array if haystack is an empty array.
 */
export function getObjectsSortedByDistanceToNeedle<T extends Pos2D>(
  haystack: T[],
  needle: Pos2D,
): T[] {
  if (haystack.length === 0) {
    return [];
  }
  const objektsWithDistances: {haystackItem: T; distance: number}[] = [];

  const nearestHaystackItem = haystack[0]!;
  getSquareDistance(
    nearestHaystackItem.posX,
    nearestHaystackItem.posY,
    needle.posX,
    needle.posY,
  );
  for (let i = 0; i < haystack.length; i += 1) {
    const haystackItem = haystack[i]!;
    const squareDistance = getSquareDistance(
      haystackItem.posX,
      haystackItem.posY,
      needle.posX,
      needle.posY,
    );
    objektsWithDistances.push({haystackItem, distance: squareDistance});
  }

  objektsWithDistances.sort((itemA, itemB) => {
    const a = itemA.distance;
    const b = itemB.distance;
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  return objektsWithDistances.map(i => i.haystackItem);
}
