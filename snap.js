/**
 * Advanced lightweight boundary positioning engine.
 * @param {HTMLElement} anchor - The reference trigger element.
 * @param {HTMLElement} floating - The element to position (tooltip, popover).
 * @param {Object} config - Alignment configurations.
 */
export function snap(anchor, floating, config = {}) {
  if (!anchor || !floating) return;

  const options = {
    position: config.position || 'top',
    offset: config.offset || 8,
    boundaryGap: config.boundaryGap || 12,
    fallback: config.fallback !== false
  };

  // Enforce structural CSS foundations for calculation safety
  floating.style.position = 'absolute';
  floating.style.top = '0';
  floating.style.left = '0';

  const anchorRect = anchor.getBoundingClientRect();
  const floatRect = floating.getBoundingClientRect();

  // Handle absolute container offset baselines (when parent has position relative)
  const offsetParent = floating.offsetParent || document.body;
  const parentRect = offsetParent.getBoundingClientRect();
  const parentScrollTop = offsetParent === document.body ? 0 : offsetParent.scrollTop;
  const parentScrollLeft = offsetParent === document.body ? 0 : offsetParent.scrollLeft;

  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let computedTop = 0;
  let computedLeft = 0;
  let activePos = options.position;

  // Contextual fallback mapping when structural viewport overflow is imminent
  if (options.fallback) {
    if (options.position === 'top' && (anchorRect.top - floatRect.height - options.offset < options.boundaryGap)) {
      activePos = 'bottom';
    } else if (options.position === 'bottom' && (window.innerHeight - anchorRect.bottom - floatRect.height - options.offset < options.boundaryGap)) {
      activePos = 'top';
    }
  }

  // Calculate coordinates relative to page origin
  const absoluteAnchorTop = anchorRect.top + scrollY;
  const absoluteAnchorLeft = anchorRect.left + scrollX;

  switch (activePos) {
    case 'top':
      computedTop = absoluteAnchorTop - floatRect.height - options.offset;
      computedLeft = absoluteAnchorLeft + (anchorRect.width / 2) - (floatRect.width / 2);
      break;
    case 'bottom':
      computedTop = absoluteAnchorTop + anchorRect.height + options.offset;
      computedLeft = absoluteAnchorLeft + (anchorRect.width / 2) - (floatRect.width / 2);
      break;
    case 'left':
      computedTop = absoluteAnchorTop + (anchorRect.height / 2) - (floatRect.height / 2);
      computedLeft = absoluteAnchorLeft - floatRect.width - options.offset;
      break;
    case 'right':
      computedTop = absoluteAnchorTop + (anchorRect.height / 2) - (floatRect.height / 2);
      computedLeft = absoluteAnchorLeft + anchorRect.width + options.offset;
      break;
  }

  // Adapt to relative parent matrices if nested inside layout containers
  if (offsetParent !== document.body) {
    computedTop = computedTop - (parentRect.top + scrollY) + parentScrollTop;
    computedLeft = computedLeft - (parentRect.left + scrollX) + parentScrollLeft;
  }

  // Hardened Viewport Collision Checking (Clamping horizontal axis)
  const viewportWidth = window.innerWidth;
  const relativeLeftBoundary = offsetParent === document.body ? 0 : parentRect.left;
  
  const minimumAllowedLeft = options.boundaryGap;
  const maximumAllowedLeft = viewportWidth - floatRect.width - options.boundaryGap;

  if (computedLeft < minimumAllowedLeft) computedLeft = minimumAllowedLeft;
  if (computedLeft > maximumAllowedLeft) computedLeft = maximumAllowedLeft;

  // Apply positions utilizing GPU layer rasterization values
  floating.style.top = `${Math.round(computedTop)}px`;
  floating.style.left = `${Math.round(computedLeft)}px`;
  
  // Set data attribute for CSS targeting
  floating.setAttribute('data-snap-origin', activePos);
}

/**
 * Automatically binds and tracks snap alignment across resize and scroll behaviors.
 * @return {Function} Disconnect destructor token.
 */
export function autoSnap(anchor, floating, config = {}) {
  const update = () => snap(anchor, floating, config);
  
  window.addEventListener('resize', update, { passive: true });
  window.addEventListener('scroll', update, { passive: true });
  
  // Initial frame instantiation
  update();

  return () => {
    window.removeEventListener('resize', update);
    window.removeEventListener('scroll', update);
  };
}
