import { Post, Category, PostStatus } from './types';

export const CATEGORIES: Category[] = [
  Category.CENTRAL_GOVERNMENT,
  Category.BIHAR_GOVERNMENT,
  Category.FINANCE,
  Category.JOBS,
  Category.SCHEMES,
  Category.STUDY_MATERIAL,
];

export const ADMIN_PASSWORD = 'keshavr.5321u';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'New Scholarship Scheme for Students Announced by Central Government',
    content: '<p>The central government has launched a new scholarship program aimed at supporting students from economically weaker sections. The scheme, named "Pragati," will provide financial assistance for higher education.</p><p>Key features include:</p><ul><li>Coverage of tuition fees.</li><li>A monthly stipend for living expenses.</li><li>Eligibility criteria based on family income and academic performance.</li></ul><p>Applications will open next month on the national scholarship portal.</p>',
    category: Category.SCHEMES,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/scholarship/800/400',
  },
  {
    id: '2',
    title: 'Bihar Government Launches Portal for Job Seekers',
    content: '<p>In a major push for employment, the Bihar government has unveiled a new online portal to connect job seekers with potential employers. The platform aims to streamline the recruitment process for both government and private sector jobs within the state.</p><p>Job seekers can register, upload their resumes, and apply for vacancies directly through the portal. Companies can also post job openings and search for suitable candidates.</p>',
    category: Category.BIHAR_GOVERNMENT,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/jobportal/800/400',
  },
  {
    id: '3',
    title: 'Understanding the New Tax Reforms in Finance',
    content: '<p>The latest budget introduced several changes to the tax structure. This article breaks down the key reforms, including new income tax slabs and changes in capital gains tax. Understanding these changes is crucial for effective financial planning for the current fiscal year.</p>',
    category: Category.FINANCE,
    status: PostStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/taxreform/800/400',
  },
];