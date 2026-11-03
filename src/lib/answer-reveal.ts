type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

const NUMBER = '[0-9０-９零〇一二两三四五六七八九十百千万]+';
const ANSWER_MARKER = new RegExp(`(?:第\\s*)?${NUMBER}\\s*天答案\\s*[:：]`);
const QUESTION_MARKER = '今天的问题是：';
const BLOCK_TAGS = new Set(['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'section', 'table', 'ul']);

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

function copyWithChildren(node: HastNode, children: HastNode[]): HastNode {
  return { ...node, children };
}

function splitAt(node: HastNode, offset: number): [HastNode | null, HastNode] {
  if (node.type === 'text') {
    return [offset > 0 ? { ...node, value: node.value!.slice(0, offset) } : null, { ...node, value: node.value!.slice(offset) }];
  }
  const children = node.children ?? [];
  const before: HastNode[] = [];
  const after: HastNode[] = [];
  let remaining = offset;
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const length = textOf(child).length;
    if (remaining >= length) {
      before.push(child);
      remaining -= length;
      continue;
    }
    const [childBefore, childAfter] = splitAt(child, remaining);
    if (childBefore) before.push(childBefore);
    after.push(childAfter, ...children.slice(index + 1));
    break;
  }
  return [before.length ? copyWithChildren(node, before) : null, copyWithChildren(node, after)];
}

function markQuestion(node: HastNode) {
  if (BLOCK_TAGS.has(node.tagName ?? '') && textOf(node).includes(QUESTION_MARKER)) {
    node.properties = { ...(node.properties ?? {}), 'data-question-marker': 'true' };
  }
}

/** Detect answer sections after Markdown has become HAST, preserving generated rich HTML. */
export function rehypeAnswerReveal() {
  return (tree: HastNode) => {
    const children = tree.children ?? [];
    const answerIndex = children.findIndex((node) => {
      markQuestion(node);
      if (!BLOCK_TAGS.has(node.tagName ?? '')) return false;
      const text = textOf(node);
      const match = ANSWER_MARKER.exec(text);
      return match !== null && text.slice(0, match.index).trim().length <= 80;
    });
    if (answerIndex === -1) return;
    const answerNode = children[answerIndex];
    const match = ANSWER_MARKER.exec(textOf(answerNode));
    if (!match) return;
    const [before, answerStart] = splitAt(answerNode, match.index);
    const wrapper: HastNode = {
      type: 'element',
      tagName: 'div',
      properties: { 'data-answer-reveal': 'true' },
      children: [answerStart, ...children.slice(answerIndex + 1)],
    };
    tree.children = [...children.slice(0, answerIndex), ...(before ? [before] : []), wrapper];
  };
}
