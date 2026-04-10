/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */
(window as any).__Zone_disable_customElements = true;

/**
 * Prevent Zone.js from patching high-frequency events that do not need
 * to trigger Angular change detection, reducing unnecessary overhead on
 * mobile devices.
 */
(window as any).__zone_symbol__UNPATCHED_EVENTS = [
  'scroll',
  'mousemove',
  'touchmove',
  'pointermove',
  'mouseenter',
  'mouseleave',
  'resize',
];
