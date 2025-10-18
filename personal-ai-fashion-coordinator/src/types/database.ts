// データベーススキーマ定義 - The Core Twelveをベース

// インプット系エンティティ
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gender {
  id: string;
  name: string; // 'male', 'female', 'other'
  displayName: string;
}

export interface Age {
  id: string;
  range: string; // '20-25', '26-30', etc.
  displayName: string;
}

export interface Belonging {
  id: string;
  name: string;
  category: string; // 'accessory', 'bag', 'shoes', etc.
}

export interface PhysicType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
}

export interface FaceType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
}

export interface PersonalColorType {
  id: string;
  name: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  description: string;
  recommendedColors: string[];
}

export interface Preference {
  id: string;
  userId: string;
  style: string; // 'casual', 'formal', 'street', etc.
  colors: string[];
  patterns: string[];
  materials: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

// クローゼット関連
export interface ClosetItem {
  id: string;
  userId: string;
  imageUrl: string;
  category: ClothingCategory;
  color: string;
  pattern: string;
  material?: string;
  brand?: string;
  size?: string;
  purchaseDate?: Date;
  price?: number;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ClothingCategory = 
  | 'tops' | 'bottoms' | 'dresses' | 'outerwear' 
  | 'shoes' | 'accessories' | 'bags' | 'jewelry';

export interface PotentialBuy {
  id: string;
  userId: string;
  imageUrl: string;
  productUrl?: string;
  category: ClothingCategory;
  color: string;
  pattern: string;
  material?: string;
  brand?: string;
  price?: number;
  size?: string;
  tags: string[];
  status: 'considering' | 'decided' | 'purchased' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// アウトプット系エンティティ
export interface Ideal {
  id: string;
  userId: string;
  styleDirection: string;
  colorPalette: string[];
  keyItems: string[];
  avoidItems: string[];
  season: string;
  occasion: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IdeasNow {
  id: string;
  userId: string;
  coordinationId: string;
  items: {
    closetItemId: string;
    role: 'main' | 'accent' | 'base';
  }[];
  occasion: string;
  season: string;
  style: string;
  imageUrl?: string;
  description: string;
  createdAt: Date;
}

export interface IdeasFuture {
  id: string;
  userId: string;
  coordinationId: string;
  items: {
    closetItemId?: string;
    potentialBuyId?: string;
    role: 'main' | 'accent' | 'base';
  }[];
  occasion: string;
  season: string;
  style: string;
  imageUrl?: string;
  description: string;
  createdAt: Date;
}

export interface Action {
  id: string;
  userId: string;
  potentialBuyId: string;
  decision: 'buy' | 'hold' | 'reject';
  reason?: string;
  comment?: string;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  userId: string;
  coordinationId: string;
  type: 'ideas_now' | 'ideas_future';
  rating: 'like' | 'dislike' | 'neutral';
  comment?: string;
  createdAt: Date;
}

// AI画像認識結果
export interface ImageAnalysisResult {
  category: ClothingCategory;
  color: string;
  pattern: string;
  material?: string;
  confidence: number;
  tags: string[];
}

// コーディネート提案
export interface CoordinationProposal {
  id: string;
  userId: string;
  type: 'ideas_now' | 'ideas_future';
  items: {
    id: string;
    type: 'closet' | 'potential_buy';
    role: 'main' | 'accent' | 'base';
    imageUrl: string;
  }[];
  occasion: string;
  season: string;
  style: string;
  description: string;
  confidence: number;
  createdAt: Date;
}