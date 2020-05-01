import { useState } from "react";

export function preventDefault(ev: Event) {
  ev.preventDefault();
}

export function useForceUpdate() {
  const [, setVal] = useState();
  return () => setVal({});
}

export function eventValue(func: Function) {
  return function(ev?: any) {
    if (ev && ev.target) {
      func(ev.target.value);
      return;
    }

    func(null);
  };
}
