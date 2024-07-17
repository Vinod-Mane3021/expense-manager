import { useMedia } from "react-use";
export const useIsMobile = (maxWidth?: number) => {
  const width = maxWidth || 1024;
  const isMobile = useMedia(`(max-width: ${width}px)`, false);
  return isMobile;
};
