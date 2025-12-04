
export type Category = string;

export enum PostStatus {
  DRAFT = "Draft",
  PUBLISHED = "Published",
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: Category;
  tags: string[]; // New field for tags
  status: PostStatus;
  createdAt: string;
  imageUrl: string;
  author?: string;
}
