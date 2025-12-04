
import { Post, PostStatus } from './types';

// The new categories are essentially the trending tags requested
export const CATEGORIES: string[] = [
  'Free Followers',
  'Instagram',
  'AI',
  'CapCut',
  'ChatGPT',
  'Google AI Studio',
  'Psychology',
  'YouTube',
  'Image',
  'Image Genrate',
  'Image to Video',
  'Blogger',
  'Bot',
  'Earn Money Online'
];

// Placeholder content matching the "Creative Mind" viral/tech tips vibe
export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'How To Earn Money From BHIM App? Step by Step Guide',
    content: '<p>The BHIM app isn\'t just for payments; it can be a source of income if you know how to use the referral schemes effectively. In this guide, we break down the cashback offers and referral bonuses available in 2025.</p><p>Learn how to maximize your daily transactions to earn rewards directly into your bank account.</p>',
    category: 'Earn Money Online',
    tags: ['Earn Money Online', 'Apps', 'Finance', 'UPI', 'Bot'],
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/bhim/800/400',
    author: 'Creative Admin'
  },
  {
    id: '2',
    title: 'How To Increase Real Instagram Followers (100% Free)',
    content: '<p>Struggling to grow your Instagram? Forget buying bots. We reveal the psychological tricks and content strategies that actually drive real engagement.</p><ul><li>Reel algorithm secrets</li><li>Hashtag strategies for 2025</li><li>Timing your posts</li></ul><p>Get ready to see your follower count skyrocket organically.</p>',
    category: 'Free Followers',
    tags: ['Free Followers', 'Instagram', 'Growth', 'Viral', 'Psychology'],
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/insta/800/400',
    author: 'Social Guru'
  },
  {
    id: '3',
    title: 'How To Make Viral Deep Psychology Videos in Mobile',
    content: '<p>Dark psychology and mindset videos are taking over YouTube Shorts and Reels. You don\'t need a PC to create them. Here are the best mobile apps to edit high-quality viral shorts.</p><p>We review CapCut templates and AI voiceover tools that make editing a breeze.</p>',
    category: 'Psychology',
    tags: ['Psychology', 'Editing', 'Mobile', 'YouTube', 'CapCut', 'Image to Video'],
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/viral/800/400',
    author: 'Video Editor'
  },
  {
    id: '4',
    title: 'Top 5 Secret AI Tools That Feel Illegal To Know',
    content: '<p>AI is moving fast. These 5 tools can automate your work, write your emails, and even edit your videos automatically. Use them wisely!</p><p>From deepfake detection to automated coding assistants, explore the cutting edge of productivity.</p>',
    category: 'AI',
    tags: ['AI', 'Tools', 'Productivity', 'Future', 'ChatGPT', 'Google AI Studio'],
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/ai/800/400',
    author: 'Tech Insider'
  },
  {
    id: '5',
    title: 'Best Budget Gaming Phones Under 15000 in 2025',
    content: '<p>Mobile gaming is getting heavier, but your phone doesn\'t have to be expensive. We tested the latest budget beasts from Realme, Redmi, and Poco.</p><p>See which phone handles BGMI and COD Mobile at 60FPS without overheating.</p>',
    category: 'Gaming',
    tags: ['Gaming', 'Hardware', 'Mobile', 'Android', 'Blogger'],
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/mobilegame/800/400',
    author: 'Gamer X'
  },
];
