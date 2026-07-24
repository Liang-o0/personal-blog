<template>
  <div class="py-4 max-w-2xl mx-auto">
    <h1 class="text-3xl font-extrabold tracking-tight mb-6">关于我</h1>
    
    <article class="prose prose-slate dark:prose-invert">
      <p>你好！我是 PWL，一名热爱前端开发与设计的技术探索者。</p>
      <p>这个博客是我写文章、整理笔记的个人空间。整个网站搭建在极速的 <strong>Vite + Vue 3</strong> 引擎上，样式依靠 <strong>Tailwind CSS</strong>，部署通过 GitHub Action 和 <strong>Cloudflare Pages</strong> 实现了每一次推送自动发布。</p>
      
      <h3>我关注的领域</h3>
      <ul>
        <li>前端技术 (React, Vue, Vite, Tailwind)</li>
        <li>全栈开发与自动化部署</li>
        <li>人机交互界面与现代视觉排版</li>
      </ul>

      <h3>如何找到我</h3>
      <p>你也可以在以下地方与我交流：</p>
      <ul>
        <li>GitHub: <a href="https://github.com" target="_blank">github.com</a></li>
        <li>Email: <a href="mailto:example@example.com">example@example.com</a></li>
      </ul>
    </article>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  document.title = '关于我 - MyBlog'
})
</script>
