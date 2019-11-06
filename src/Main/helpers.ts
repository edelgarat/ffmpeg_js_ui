import { useState } from "react";
export function preventDefault(ev: Event) {
  ev.preventDefault();
}

export function useForceUpdate() {
  const [, setVal] = useState();
  return () => setVal({});
}
