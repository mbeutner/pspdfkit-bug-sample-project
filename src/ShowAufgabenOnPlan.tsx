import React from 'react';
import {placeMarker} from './util/place-marker';
import {removeAllMarkers} from './util/remove-marker';
import PSPDFKitView, {
  PageTouchedEvent,
  ZoomLevelEvent,
} from 'react-native-pspdfkit';
import {Pos2D} from './util/getObjectsSortedByDistanceToNeedle';
import {getWindow} from './util/shared';
import {group} from './Grouping';
import VerortungPlan from './VerortungPlan';
import {getMarkers} from './mock/getMarkers';

function getVectorStampAsset(ids: number[]) {
  if (ids.length > 9) {
    return 'VerortungPin_group9plus.pdf';
  }
  if (ids.length === 1) {
    return 'VerortungPin_red.pdf';
  }
  return `VerortungPin_group${ids.length}.pdf`;
}

export interface Marker {
  imageUuid: string;
  posX: number;
  posY: number;
}

export enum ShowAufgabenViewState {
  ShowAufgaben,
  Verortung,
}

interface GroupedMarker {
  marker: Marker;
  aufgabenIds: number[];
}

class ShowAufgabenOnPlan extends React.PureComponent {
  currentZoomLevel = 1;

  planRef: PSPDFKitView | null = null;

  isRendering = false;

  dirty = false;

  constructor(props: {}) {
    super(props);
  }

  handleZoomLevelChanged = async (event: ZoomLevelEvent) => {
    // to suppress the inital zoomLevelChanged event
    if (this.currentZoomLevel === event.zoomLevel) {
      return;
    }
    this.currentZoomLevel = event.zoomLevel;
    this.updateMarker();
  };

  handleVerortungPlanRef = (ref: PSPDFKitView) => {
    this.planRef = ref;
    setTimeout(() => {
      this.updateMarker();
    }, 300);
  };

  async placeMarker(marker: Pos2D, aufgabenIds: number[]) {
    if (this.planRef) {
      const window = getWindow();
      const vectorStampAsset = getVectorStampAsset(aufgabenIds);
      await placeMarker({
        vectorStampAsset,
        marker,
        pspdfKitView: this.planRef,
        zoomLevel: this.currentZoomLevel,
        aufgabenIds,
        window,
      });
    }
  }

  async updateMarker() {
    if (this.isRendering) {
      this.dirty = true;
      return;
    }
    this.isRendering = true;
    const markers = getMarkers();
    const neighborHoodSize = (1 / this.currentZoomLevel) * 200;
    const groupedMarkers: GroupedMarker[] = group(
      markers.map(m => {
        return {
          posX: m[0].posX,
          posY: m[0].posY,
          aufgabenId: m[1].id,
        };
      }),
      neighborHoodSize,
    ).map(m => {
      return {
        marker: {posX: m.posX, posY: m.posY},
        aufgabenIds: m.aufgabenIds,
      } as GroupedMarker;
    });
    await this.removeAllMarkers();

    await Promise.all(
      groupedMarkers.map(({marker, aufgabenIds}) => {
        return this.placeMarker(marker, aufgabenIds);
      }),
    );
    this.isRendering = false;
    if (this.dirty) {
      this.dirty = false;
      await this.updateMarker();
    }
  }

  async removeAllMarkers() {
    if (this.planRef) {
      await removeAllMarkers(this.planRef);
    }
  }

  onPageTouched(evt: PageTouchedEvent) {
    console.log({evt});
  }

  render() {
    return (
      <VerortungPlan
        ref={this.handleVerortungPlanRef}
        onZoomLevelChanged={this.handleZoomLevelChanged}
        androidFragmentTag="ShowAufgabenOnPlan"
      />
    );
  }
}
export default ShowAufgabenOnPlan;
