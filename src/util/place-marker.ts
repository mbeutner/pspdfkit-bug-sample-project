import {Platform} from 'react-native';
import PSPDFKit from 'react-native-pspdfkit';
import {Window, Pos2D} from './shared';

const normalizedSizeOfMarker = 80;

interface PlaceMarkerOpts {
  pspdfKitView: PSPDFKit;
  marker: Pos2D;
  vectorStampAsset: string;
  zoomLevel?: number;
  aufgabenIds?: number[];
  window: Window;
}

export const placeMarker = async ({
  marker,
  vectorStampAsset,
  pspdfKitView,
  window,
  zoomLevel = 1,
  aufgabenIds,
}: PlaceMarkerOpts) => {
  // compute size of marker with respect of device width & pdf width
  const pageSize = await pspdfKitView.getSizeOfFirstPage();
  if (!pageSize) {
    return;
  }

  const createBaseConfig = () => {
    if (Platform.OS === 'android') {
      const annotationSize =
        ((pageSize.width / window.width) * normalizedSizeOfMarker) / zoomLevel;
      return {
        type: 'pspdfkit/stamp',
        vectorStampAsset,
        // stampType: 'rejected',
        bbox: [
          marker.posX - annotationSize / 2,
          marker.posY - annotationSize / 2,
          annotationSize,
          annotationSize,
        ],
        flags: ['NOZOOM', 'LOCKEDCONTENTS', 'LOCKED'], // making annotation read-only & same size for all zoom levels
      };
    }
    if (Platform.OS === 'ios') {
      const X = 256;
      const Y = 128;

      return {
        type: 'pspdfkit/note',
        bbox: [marker.posX - X / 2, marker.posY - Y / 2, X, Y],
        customData: {
          vectorStampAsset,
        },
      };
    }
    throw new Error('platform not supported');
  };

  const baseConfig = createBaseConfig();
  const config = {
    ...baseConfig,
    stampType: 'Custom',
    v: 1,
    pageIndex: 0,
    opacity: 1,
    rotation: 0,
    // fixes random crashes on android when markers are (re)drawn due to filter changes
    title: ' ',
    // the name is necessary & should be unique & should start with a letter - otherwise programmatic removal does not work
    name: `Marker for ${aufgabenIds?.join(',')}`,
    customData: {
      ...(baseConfig.customData ?? {}),
      aufgabenIds,
    },
  };

  await pspdfKitView.addAnnotation(config);
};
