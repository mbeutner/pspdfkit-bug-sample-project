interface MarkerWithAufgabenId {
  posX: number;
  posY: number;
  aufgabenId: number;
}

interface MarkerWithAufgabenIds {
  posX: number;
  posY: number;
  aufgabenIds: number[];
}
function avg(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export function group(
  markers: MarkerWithAufgabenId[],
  neighborhoodSize: number,
): MarkerWithAufgabenIds[] {
  if (markers.length === 0) {
    return [] as MarkerWithAufgabenIds[];
  }
  let remainingMarkers: MarkerWithAufgabenId[] = markers.map(x => ({...x})); // copy input markers
  const markerToFindOverlapsFor: MarkerWithAufgabenId =
    remainingMarkers.shift()!;
  const overlappingGroup: MarkerWithAufgabenId[] = [markerToFindOverlapsFor];

  remainingMarkers.forEach(marker => {
    if (
      Math.abs(marker.posX - markerToFindOverlapsFor.posX) <=
        neighborhoodSize &&
      Math.abs(marker.posY - markerToFindOverlapsFor.posY) <= neighborhoodSize
    ) {
      overlappingGroup.push(marker);
    }
  });
  const markerRepresentingTheOverlappingGroup = {
    posX: avg([...overlappingGroup.map(e => e.posX)]),
    posY: avg([...overlappingGroup.map(e => e.posY)]),
    aufgabenIds: [...overlappingGroup.map(e => e.aufgabenId)],
  };
  // remove all markers that flew into the overlapping group from the remaining markers
  remainingMarkers = remainingMarkers.filter(
    m => !overlappingGroup.includes(m),
  );

  if (remainingMarkers.length !== 0) {
    return [
      markerRepresentingTheOverlappingGroup,
      ...group(remainingMarkers, neighborhoodSize),
    ] as MarkerWithAufgabenIds[];
  }
  return [markerRepresentingTheOverlappingGroup] as MarkerWithAufgabenIds[];
}
