export const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
export const isMobile = window.navigator.userAgent
  .toLowerCase()
  .includes("mobi");
