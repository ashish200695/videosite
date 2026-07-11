export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'CONTRIBUTOR';
  bio?: string;
  profileImage?: string;
  revenueShare: number;
  totalEarnings: number;
  totalPaid: number;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  dailymotionVideoId: string;
  viewCount: number;
  estimatedRevenue: number;
  contributorId?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  language: string;
  videoFileUrl?: string;
  thumbnailUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  rejectionReason?: string;
  contributorId: string;
  storyId?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
}

export interface RevenueRecord {
  id: string;
  storyId: string;
  viewCount: number;
  estimatedRevenue: number;
  contributorEarnings: number;
  platformEarnings: number;
  revenueShare: number;
  recordDate: Date;
}

export interface Payout {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  payoutMethod: 'BANK_TRANSFER' | 'UPI' | 'PAYPAL';
  transactionId?: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface SubmissionFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  language: string;
  thumbnail?: File;
  video?: File;
  dailymotionUrl?: string;
  termsAccepted: boolean;
}
