
export enum Category {
  CENTRAL_GOVERNMENT = "Central Government",
  BIHAR_GOVERNMENT = "Bihar Government",
  FINANCE = "Finance",
  JOBS = "Jobs",
  SCHEMES = "Government Schemes",
  STUDY_MATERIAL = "Study Material",
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
}
