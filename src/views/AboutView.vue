<template>
  <div class="mx-auto max-w-5xl space-y-12 pb-20">
    <!-- Header Story Card (Asymmetric) -->
    <section class="glass-card-custom overflow-hidden rounded-[2rem] border border-border/40">
      <div class="grid gap-8 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div class="space-y-6">
          <p class="text-xs font-bold uppercase tracking-widest text-primary"><TextAnimate text="The Blogger" /></p>
          <h2 class="text-balance text-4xl font-extrabold tracking-tight text-text sm:text-5xl leading-[1.15]">
            <TextAnimate text="你好，我是liang ——" />
            <br />
            <TextAnimate text="欢迎来到我的  Personal Blog." :delay="35" />
          </h2>
          <p class="text-base leading-relaxed text-muted">
            这是一个用来安放文字、代码和瞬间的地方。我喜欢用文字把思绪固定，用代码把想象变为现实，用镜头把美好的瞬间留存。
          </p>

          <div class="flex flex-wrap gap-2.5">
            <span
              v-for="badge in badges"
              :key="badge"
              class="rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold text-text"
            >
              {{ badge }}
            </span>
          </div>
        </div>

        <div class="overflow-hidden rounded-[1.5rem] bg-card/80 border border-border/40 p-4 relative group">
          <div class="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-custom rounded-[1.25rem]"></div>
          <img
            :src="heroImage"
            alt="My Visual Device"
            class="w-full rounded-[1.25rem] object-cover drop-shadow-[0_20px_40px_rgba(var(--primary),0.15)] group-hover:scale-[1.02] transition-transform duration-700 ease-custom"
          />
        </div>
      </div>
    </section>

    <!-- Asymmetric grid for "Thoughts" & "Contact details" -->
    <section class="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <!-- Left Column: Thoughts and Gratitude (我想说的一些话 & 感谢) -->
      <div class="glass-card-custom rounded-[2rem] p-8 md:p-10 space-y-8 border border-border/40">
        <div class="space-y-4">
          <p class="text-xs font-bold uppercase tracking-widest text-primary"><TextAnimate text="Thoughts & Thanks" /></p>
          <h2 class="text-3xl font-extrabold tracking-tight text-text"><TextAnimate text="见字如面，我想说的一些话" :delay="40" /></h2>
        </div>

        <div class="space-y-6 text-sm text-muted leading-relaxed">
          <div class="space-y-2">
            <h3 class="text-base font-bold text-text flex items-center gap-2">
              <iconify-icon icon="lucide:feather" class="text-primary"></iconify-icon>
              关于这个博客的缘起
            </h3>
            <p>
              做这个个人博客的初衷非常简单：在越来越碎片化的网络时代，给自己搭建一个可以安下心来敲击键盘的避风港。
              我们习惯了在社交软件上快速浏览、点赞、划过，而在这里，我希望文字和思想能够稍微沉淀下来，拥有一段更加恒久的生命。
            </p>
          </div>

          <div class="space-y-2">
            <h3 class="text-base font-bold text-text flex items-center gap-2">
              <iconify-icon icon="lucide:heart" class="text-accent"></iconify-icon>
              致每一位路过这里的你
            </h3>
            <p>
              非常感谢你能点开这个小小的网页，愿意花上几分钟来看看我的碎碎念。互联网是无垠的沙滩，我们都在寻找属于自己的那颗贝壳。
              无论你是通过什么方式来到这里，能看到这段话，就是我们微小但真实的缘分。
            </p>
          </div>

          <div class="space-y-2">
            <h3 class="text-base font-bold text-text flex items-center gap-2">
              <iconify-icon icon="lucide:award" class="text-secondary"></iconify-icon>
              真诚的谢意
            </h3>
            <p>
              感谢那些一直在身边引导我探索新事物的朋友们，
              同时，也感谢那些在开源世界中无私分享知识与灵感的创造者们，是你们做出的优秀工具让这个博客的每一像素都变得更加灵动。
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Contact Details (联系方式) -->
      <div class="glass-card-custom rounded-[2rem] p-8 space-y-8 border border-border/40 flex flex-col justify-between">
        <div class="space-y-6">
          <div class="space-y-2">
            <p class="text-xs font-bold uppercase tracking-widest text-secondary"><TextAnimate text="Get in Touch" /></p>
            <h2 class="text-2xl font-extrabold tracking-tight text-text"><TextAnimate text="联系我" :delay="40" /></h2>
          </div>

          <div class="space-y-4">
            <div 
              v-for="contact in contacts" 
              :key="contact.platform"
              class="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border/40 group hover:border-secondary/30 transition-all duration-300 ease-custom"
            >
              <div class="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500 ease-custom">
                <iconify-icon :icon="contact.icon" class="text-lg"></iconify-icon>
              </div>
              <div class="space-y-0.5">
                <p class="text-xs text-muted font-medium">{{ contact.platform }}</p>
                <p class="text-sm font-bold text-text select-all">{{ contact.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3">
          <SlideButton
            text1="回到首页"
            text2="GO HOME ➔"
            to="/"
          />
          <SlideButton
            text1="阅读精选文章"
            text2="READ POSTS ➔"
            to="/#articles"
            class="bg-gradient-to-r from-secondary/80 to-[#fa5c15]/80"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import heroImage from '../assets/hero.png'
import SlideButton from '../components/ui/SlideButton.vue'
import TextAnimate from '../components/ui/TextAnimate.vue'

const badges = ['Brave', 'Confident', 'Positive', 'Kindness']

const contacts = [
  {
    platform: 'Google Mail',
    icon: 'lucide:mail',
    value: 'wenlianpu63@gmail.com'
  },
  {
    platform: 'QQ Mail',
    icon: 'lucide:message-square',
    value: '1804125721@qq.com'
  },
  {
    platform: 'GitHub 仓库',
    icon: 'lucide:github',
    value: 'Liang-o0'
  }
]

onMounted(() => {
  document.title = '关于我 · PWL Journal'
})
</script>
