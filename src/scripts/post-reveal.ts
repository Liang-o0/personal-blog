/** Observe individual cards so long lists reveal only the rows being viewed. */
function setupPostReveal() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.post-reveal'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!items.length || motion.matches || !('IntersectionObserver' in window)) return;

  const reveal = (item: HTMLElement, index = 0) => {
    item.style.setProperty('--post-reveal-index', String(index));
    item.classList.remove('reveal-pending');
    item.classList.add('reveal-visible');
    observer.unobserve(item);
  };
  const observer = new IntersectionObserver(entries => {
    const groups = new Map<Element | null, number>();
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const item = entry.target as HTMLElement;
      const group = item.parentElement;
      const index = groups.get(group) ?? 0;
      reveal(item, index);
      groups.set(group, index + 1);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  for (const item of items) {
    item.classList.add('reveal-pending');
    observer.observe(item);
  }
  // Keyboard navigation must never land on an invisible link.
  const onFocus = (event: FocusEvent) => {
    const item = (event.target as Element)?.closest<HTMLElement>('.reveal-pending');
    if (item) reveal(item);
  };
  const showAll = () => {
    observer.disconnect();
    items.forEach(item => item.classList.remove('reveal-pending', 'reveal-visible'));
  };
  const onMotion = () => { if (motion.matches) showAll(); };
  document.addEventListener('focusin', onFocus);
  motion.addEventListener('change', onMotion);
  return () => {
    showAll();
    document.removeEventListener('focusin', onFocus);
    motion.removeEventListener('change', onMotion);
  };
}

let cleanup: (() => void) | undefined;
let currentMain: HTMLElement | null = null;
const resetPostReveal = () => {
  cleanup?.();
  cleanup = undefined;
  currentMain = null;
};
const initializePostReveal = () => {
  const main = document.querySelector('main');
  if (main === currentMain) return;
  resetPostReveal();
  currentMain = main;
  cleanup = setupPostReveal();
};
document.addEventListener('astro:before-swap', resetPostReveal);
document.addEventListener('astro:page-load', initializePostReveal);
window.addEventListener('pagehide', resetPostReveal);
window.addEventListener('pageshow', initializePostReveal);
// Initial animations should not wait for remote photos to finish loading.
initializePostReveal();
