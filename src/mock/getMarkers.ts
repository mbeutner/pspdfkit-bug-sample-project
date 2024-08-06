import {Marker} from '../ShowAufgabenOnPlan';

// mock data from backend
export function getMarkers(): [Marker, {id: number}][] {
  return [
    [
      {
        imageUuid: '', // irrelevant
        posX: 300,
        posY: 260,
      },
      {id: 1},
    ],
    [
      {
        imageUuid: '', // irrelevant
        posX: 300,
        posY: 300,
      },
      {id: 2},
    ],
    [
      {
        imageUuid: '', // irrelevant
        posX: 300,
        posY: 600,
      },
      {id: 3},
    ],
    [
      {
        imageUuid: '', // irrelevant
        posX: 300,
        posY: 500,
      },
      {id: 3},
    ],
    [
      {
        imageUuid: '', // irrelevant
        posX: 300,
        posY: 650,
      },
      {id: 3},
    ],
    [
      {
        imageUuid: '', // irrelevant
        posX: 700,
        posY: 380,
      },
      {id: 3},
    ],
  ];
}
