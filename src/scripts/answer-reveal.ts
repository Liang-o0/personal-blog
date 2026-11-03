import { createApp } from 'vue';
import AnswerReveal from '../components/ui/AnswerReveal.vue';

const mounted = new WeakMap<HTMLElement, ReturnType<typeof createApp>>();

function mountAnswerReveals() {
  document.querySelectorAll<HTMLElement>('[data-answer-reveal]').forEach((element) => {
    if (mounted.has(element)) return;
    const content = element.innerHTML;
    element.dataset.answerRevealPending = 'true';
    const app = createApp(AnswerReveal, { content });
    mounted.set(element, app);
    app.mount(element);
    delete element.dataset.answerRevealPending;
  });
}

function unmountAnswerReveals() {
  document.querySelectorAll<HTMLElement>('[data-answer-reveal]').forEach((element) => {
    mounted.get(element)?.unmount();
    mounted.delete(element);
  });
}

document.addEventListener('astro:page-load', mountAnswerReveals);
document.addEventListener('astro:before-swap', unmountAnswerReveals);
mountAnswerReveals();
