import {useEffect, useState} from 'react';
import * as RNFS from 'react-native-fs';
import base64 from './base64';

type Result = IErrorResult | ISuccessResult;

interface IErrorResult {
  type: 'error';
  err: unknown;
}

interface ISuccessResult {
  type: 'success';
  filePath: string;
}

const filePath = `${RNFS.DocumentDirectoryPath}/mockPdf.pdf`;

// mock download plan
export function useFetchPlan() {
  const [result, setResult] = useState<Result | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        await RNFS.writeFile(filePath, base64, 'base64');
        setResult({
          type: 'success',
          filePath,
        });
      } catch (err) {
        console.error('error while mock fetching:', {err});
        setResult({
          type: 'error',
          err,
        });
      }
    })();
  }, []);

  return result;
}
