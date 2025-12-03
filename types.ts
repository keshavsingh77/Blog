
export enum Category {
  TECH = "Tech",
  GAMING = "Gaming",
  ENTERTAINMENT = "Entertainment",
  MOVIES = "Movies",
  REVIEWS = "Reviews",
  NEWS = "News",
}

export enum PostStatus {
  DRAFT = "Draft",
  PUBLISHED = "Published",
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: Category;
  status: PostStatus;
  createdAt: string;
  imageUrl: string;
  author?: string;
}
