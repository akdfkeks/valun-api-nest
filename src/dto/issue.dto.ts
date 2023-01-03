import { Issue as PIssue } from '@prisma/client';

export interface CreateIssueDto {
  description: string;
  category: string;
  lat: number;
  lng: number;
}

export interface IIssue {
  id: number;
  userId: string;
  status: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: Date;
  imageUrl: string;
}

export interface RawIssue extends PIssue {
  category: { name: string };
  image: { location: string };
}
