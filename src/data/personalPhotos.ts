export interface PersonalPhoto {
  url: string
  title: string
  date: string
  caption: string
}

export const personalPhotos: PersonalPhoto[] = [
  { url: 'https://picsum.photos/id/1011/900/600', title: '山野之间', date: '01 / OUTDOOR', caption: '在开阔的风景里整理思绪，也记录那些让人重新出发的片刻。' },
  { url: 'https://picsum.photos/id/1015/900/600', title: '沿途风景', date: '02 / JOURNEY', caption: '慢慢走，观察沿途的光线、颜色和偶然遇见的人。' },
  { url: 'https://picsum.photos/id/1025/900/600', title: '日常陪伴', date: '03 / DAILY', caption: '生活里细小但可靠的陪伴，组成了最值得保存的日常。' },
  { url: 'https://picsum.photos/id/1035/900/600', title: '城市漫游', date: '04 / CITY', caption: '在熟悉和陌生之间穿行，寻找城市里安静的角落。' },
  { url: 'https://picsum.photos/id/1043/900/600', title: '自然光线', date: '05 / LIGHT', caption: '喜欢自然光落下来的瞬间，它让普通的场景也有了层次。' },
  { url: 'https://picsum.photos/id/1069/900/600', title: '海边片段', date: '06 / WEEKEND', caption: '把周末交给海风，暂时离开屏幕和待办事项。' }
]
