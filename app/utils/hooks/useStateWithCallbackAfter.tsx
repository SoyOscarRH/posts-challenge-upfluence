import { useState, useEffect, useRef, useCallback } from 'react';

function useStateWithCallbackAfter<T>(initialValue: T) {
  const [state, _setState] = useState(initialValue);

  const callbackQueue = useRef([] as Array<() => void>);
  useEffect(() => {
    callbackQueue.current.forEach(callback => callback());
    callbackQueue.current = [];
  }, [state]);

  type setStateArg = Parameters<typeof _setState>[0];
  const setState = useCallback((newValue: setStateArg, callback?: () => void) => {
    _setState(newValue);
    if (callback) callbackQueue.current.push(callback);
  }, []);

  return [state, setState] as const;
};

export default useStateWithCallbackAfter;