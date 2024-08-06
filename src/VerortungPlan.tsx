import React, {forwardRef, Ref, useCallback, useRef} from 'react';
import PSPDFKitView, {
  PageTouchedEvent,
  ZoomLevelEvent,
} from 'react-native-pspdfkit';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {useFetchPlan} from './mock/useFetchPlan';

export const style = StyleSheet.create({
  InfoContainer: {
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  ActivityIndicator: {
    margin: 20,
  },
  PSPDFKitView: {
    flex: 1,
  },
});

interface VerortungPlanProps {
  onZoomLevelChanged: (evt: ZoomLevelEvent) => void;
  androidFragmentTag: string;
  onPageTouched?: (evt: PageTouchedEvent) => void;
}
const VerortungPlan = forwardRef(
  (
    {onZoomLevelChanged, onPageTouched, androidFragmentTag}: VerortungPlanProps,
    ref: Ref<PSPDFKitView>,
  ) => {
    const downloadResult = useFetchPlan();

    const tId = useRef<NodeJS.Timeout | undefined>();
    const handleZoomLevelChanged = useCallback(
      (evt: ZoomLevelEvent) => {
        // debounce
        clearTimeout(tId.current);
        tId.current = setTimeout(() => onZoomLevelChanged(evt), 100);
      },
      [tId, onZoomLevelChanged],
    );

    if (!downloadResult) {
      const message = 'Loading...';
      return (
        <View style={style.InfoContainer}>
          <Text>{message}</Text>
        </View>
      );
    }

    // error handling -> unnecessary for mock
    if (downloadResult.type === 'error') {
      const message = 'error while reading plan';
      return (
        <View style={style.InfoContainer}>
          <Text>{message}</Text>
        </View>
      );
    }

    return (
      <PSPDFKitView
        disableAutomaticSaving
        fragmentTag={androidFragmentTag}
        ref={ref}
        document={downloadResult.filePath}
        /*
        leftBarButtonItems, rightBarButtonItems and toolbarTitle are set, because we encouter a strange bug on iOS
        when using PSPDFKitView inside tabs. (onAnnotationTapped-events are not fired anymore when switching to another
        tab and then back to the tab containing this view). For some reason, this bug does not occur when we enable
        the built-in toolbar with useParentNavigationBar = false. As we don't want a toolbar in general, we removed
        all elements from it.
         */
        leftBarButtonItems={[]}
        rightBarButtonItems={[]}
        toolbarTitle=""
        configuration={{
          // no toolbar, thumbnail or label
          showThumbnailBar: 'none',
          userInterfaceViewMode: 'alwaysHidden',
          useParentNavigationBar: Platform.OS === 'android', // needed for hiding userInterface
          enableAnnotationEditing: false,
          enableTextSelection: false,
        }}
        style={style.PSPDFKitView}
        testID="pspdfkitview"
        onZoomLevelChanged={handleZoomLevelChanged}
        onPageTouched={onPageTouched}
        disableDefaultActionForTappedAnnotations
      />
    );
  },
);

export default VerortungPlan;
