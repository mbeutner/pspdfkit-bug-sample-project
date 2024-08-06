import {Platform} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

export const removeAllMarkers = async (currentPspdfkitView: PSPDFKitView) => {
  const annotationType =
    Platform.OS === 'android' ? 'pspdfkit/stamp' : 'pspdfkit/note';

  const existingAnnotations = await currentPspdfkitView.getAnnotations(
    0,
    annotationType,
  );

  const annotations = existingAnnotations.annotations;

  if (annotations) {
    annotations.forEach(annotation => {
      currentPspdfkitView.removeAnnotation(annotation);
    });
  }
};
