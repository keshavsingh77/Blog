
import { Post, Category, PostStatus } from './types';

export const CATEGORIES: Category[] = [
  Category.TECH,
  Category.GAMING,
  Category.ENTERTAINMENT,
  Category.MOVIES,
  Category.REVIEWS,
  Category.NEWS,
];

export const ADMIN_PASSWORD = 'keshavr.5321u';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Future of VR: Apple Vision Pro 2 Rumors & Expectations',
    content: '<p>The mixed reality landscape is shifting rapidly. With competitors entering the ring, rumors about the next generation of Apple Vision Pro are heating up. Insiders suggest a lighter form factor, improved battery life, and a significantly lower price point to capture the mainstream market.</p><p>We explore what this means for developers and consumers alike, analyzing the potential impact on the gaming and productivity sectors.</p>',
    category: Category.TECH,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/vrtech/800/400',
    author: 'Alex Tech'
  },
  {
    id: '2',
    title: 'GTA VI: Everything We Know So Far About the Release',
    content: '<p>Rockstar Games has finally dropped hints about the most anticipated game of the decade. Grand Theft Auto VI is set to return to Vice City with a modern twist. Leaks confirm a dual-protagonist storyline featuring Lucia and Jason.</p><p>The graphics engine overhaul promises photorealistic weather systems and NPC interactions that will set a new benchmark for open-world games.</p>',
    category: Category.GAMING,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/gta6/800/400',
    author: 'Gamer Pro'
  },
  {
    id: '3',
    title: 'Review: Dune: Part Two is a Cinematic Masterpiece',
    content: '<p>Denis Villeneuve has done it again. Dune: Part Two expands on the first film in every conceivable way. The scale is massive, the sound design is earth-shattering, and the performances are career-best for the ensemble cast.</p><p>In this review, we dive deep into the visual storytelling and how it honors Frank Herbert’s legendary source material while carving its own path.</p>',
    category: Category.MOVIES,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/dune/800/400',
    author: 'Cinephile Jane'
  },
  {
    id: '4',
    title: 'Marvel Phase 6: Can They Recover the Magic?',
    content: '<p>After a rocky Phase 5, Marvel Studios is looking to right the ship. With the Fantastic Four casting confirmed and X-Men projects on the horizon, fans are cautiously optimistic.</p><p>We analyze the upcoming slate of films and TV shows to predict if the MCU can reclaim its dominance at the global box office.</p>',
    category: Category.ENTERTAINMENT,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/marvel/800/400',
    author: 'Stan Lee Fan'
  },
  {
    id: '5',
    title: 'Top 10 Budget Gaming Laptops of 2025',
    content: '<p>You don\'t need to break the bank to play the latest AAA titles. We\'ve tested the top budget gaming laptops from ASUS, Acer, and Lenovo to find the best bang for your buck.</p><ul><li>Performance benchmarks</li><li>Thermal management</li><li>Display quality</li></ul><p>Find out which laptop takes the crown.</p>',
    category: Category.REVIEWS,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/laptop/800/400',
    author: 'Hardware Geek'
  },
];
