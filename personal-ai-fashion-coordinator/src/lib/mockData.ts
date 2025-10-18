import { 
  User, Gender, Age, Belonging, PhysicType, FaceType, PersonalColorType, 
  Preference, ClosetItem, PotentialBuy, Ideal, IdeasNow, IdeasFuture, 
  Action, Feedback, CoordinationProposal 
} from '@/types/database';

// マスターデータ
export const genders: Gender[] = [
  { id: '1', name: 'female', displayName: '女性' },
  { id: '2', name: 'male', displayName: '男性' },
  { id: '3', name: 'other', displayName: 'その他' }
];

export const ages: Age[] = [
  { id: '1', range: '20-25', displayName: '20-25歳' },
  { id: '2', range: '26-30', displayName: '26-30歳' },
  { id: '3', range: '31-35', displayName: '31-35歳' },
  { id: '4', range: '36-40', displayName: '36-40歳' }
];

export const belongings: Belonging[] = [
  { id: '1', name: 'バッグ', category: 'accessory' },
  { id: '2', name: '時計', category: 'accessory' },
  { id: '3', name: 'ネックレス', category: 'jewelry' },
  { id: '4', name: 'イヤリング', category: 'jewelry' }
];

export const physicTypes: PhysicType[] = [
  { 
    id: '1', 
    name: 'ストレート型', 
    description: '肩幅と腰幅がほぼ同じで、直線的なシルエット',
    characteristics: ['直線的', 'バランス型', 'シンプルなデザインが似合う']
  },
  { 
    id: '2', 
    name: 'ウェーブ型', 
    description: '腰が肩より広く、曲線的なシルエット',
    characteristics: ['曲線的', 'ウエスト強調', 'フレアデザインが似合う']
  },
  { 
    id: '3', 
    name: 'ナチュラル型', 
    description: '全体的にふんわりとした柔らかい印象',
    characteristics: ['柔らかい', 'ナチュラル', 'カジュアルなデザインが似合う']
  }
];

export const faceTypes: FaceType[] = [
  { 
    id: '1', 
    name: '丸顔', 
    description: '全体的に丸みを帯びた顔型',
    characteristics: ['丸み', '柔らかい印象', 'Vネックが似合う']
  },
  { 
    id: '2', 
    name: '面長', 
    description: '縦長の顔型',
    characteristics: ['縦長', 'シャープ', '横ラインが似合う']
  },
  { 
    id: '3', 
    name: '逆三角', 
    description: '額が広く顎が細い顔型',
    characteristics: ['逆三角', 'シャープ', 'ボリュームのあるデザインが似合う']
  }
];

export const personalColorTypes: PersonalColorType[] = [
  { 
    id: '1', 
    name: 'スプリング', 
    season: 'spring',
    description: '明るく温かみのある色合いが似合う',
    recommendedColors: ['コーラル', 'イエロー', 'ライトブルー', 'ピーチ']
  },
  { 
    id: '2', 
    name: 'サマー', 
    season: 'summer',
    description: 'クールで上品な色合いが似合う',
    recommendedColors: ['パステルブルー', 'ラベンダー', 'ピンク', 'グレー']
  },
  { 
    id: '3', 
    name: 'オータム', 
    season: 'autumn',
    description: '深みのある温かみのある色合いが似合う',
    recommendedColors: ['オレンジ', 'ブラウン', 'ゴールド', 'ディープレッド']
  },
  { 
    id: '4', 
    name: 'ウィンター', 
    season: 'winter',
    description: '鮮やかでクールな色合いが似合う',
    recommendedColors: ['ネイビー', 'ホワイト', 'レッド', 'ブラック']
  }
];

// ユーザーデータ
export const mockUser: User = {
  id: 'user-1',
  name: '田中 花子',
  email: 'hanako@example.com',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const mockPreference: Preference = {
  id: 'pref-1',
  userId: 'user-1',
  style: 'casual',
  colors: ['ネイビー', 'ホワイト', 'ベージュ'],
  patterns: ['無地', 'ストライプ', 'チェック'],
  materials: ['コットン', 'デニム', 'ニット'],
  brands: ['ユニクロ', 'GU', 'ZARA'],
  priceRange: { min: 1000, max: 10000 }
};

// クローゼットアイテム
export const mockClosetItems: ClosetItem[] = [
  {
    id: 'closet-1',
    userId: 'user-1',
    imageUrl: '/images/closet/white-t-shirt.jpg',
    category: 'tops',
    color: 'ホワイト',
    pattern: '無地',
    material: 'コットン',
    brand: 'ユニクロ',
    size: 'M',
    purchaseDate: new Date('2024-01-15'),
    price: 1500,
    tags: ['ベーシック', 'カジュアル'],
    isFavorite: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'closet-2',
    userId: 'user-1',
    imageUrl: '/images/closet/blue-jeans.jpg',
    category: 'bottoms',
    color: 'ネイビー',
    pattern: '無地',
    material: 'デニム',
    brand: 'GU',
    size: 'M',
    purchaseDate: new Date('2024-01-20'),
    price: 2990,
    tags: ['デニム', 'カジュアル'],
    isFavorite: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'closet-3',
    userId: 'user-1',
    imageUrl: '/images/closet/beige-cardigan.jpg',
    category: 'outerwear',
    color: 'ベージュ',
    pattern: '無地',
    material: 'ニット',
    brand: 'ZARA',
    size: 'M',
    purchaseDate: new Date('2024-02-01'),
    price: 4500,
    tags: ['カーディガン', 'ナチュラル'],
    isFavorite: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

// 購入検討アイテム
export const mockPotentialBuys: PotentialBuy[] = [
  {
    id: 'potential-1',
    userId: 'user-1',
    imageUrl: '/images/potential/black-dress.jpg',
    productUrl: 'https://example.com/black-dress',
    category: 'dresses',
    color: 'ブラック',
    pattern: '無地',
    material: 'ポリエステル',
    brand: 'H&M',
    price: 3990,
    size: 'M',
    tags: ['ドレス', 'フォーマル'],
    status: 'considering',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'potential-2',
    userId: 'user-1',
    imageUrl: '/images/potential/red-shoes.jpg',
    productUrl: 'https://example.com/red-shoes',
    category: 'shoes',
    color: 'レッド',
    pattern: '無地',
    material: 'レザー',
    brand: 'ZARA',
    price: 5990,
    size: '24cm',
    tags: ['パンプス', 'レッド'],
    status: 'considering',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12')
  }
];

// 理想のスタイル
export const mockIdeal: Ideal = {
  id: 'ideal-1',
  userId: 'user-1',
  styleDirection: 'ナチュラルカジュアル',
  colorPalette: ['ベージュ', 'ホワイト', 'ネイビー', 'ブラウン'],
  keyItems: ['デニム', 'ニット', 'スニーカー', 'トートバッグ'],
  avoidItems: ['派手な柄', 'キラキラ', '過度にフォーマル'],
  season: '春夏',
  occasion: ['日常', 'お出かけ', 'カフェ'],
  description: '自然体で上品な印象を与えるスタイル。基本アイテムを中心に、質感と色合いを大切にしたコーディネート。',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

// 現在のコーディネート提案
export const mockIdeasNow: IdeasNow[] = [
  {
    id: 'ideas-now-1',
    userId: 'user-1',
    coordinationId: 'coord-1',
    items: [
      { closetItemId: 'closet-1', role: 'base' },
      { closetItemId: 'closet-2', role: 'main' },
      { closetItemId: 'closet-3', role: 'accent' }
    ],
    occasion: '日常',
    season: '春',
    style: 'ナチュラルカジュアル',
    imageUrl: '/images/coordinations/casual-look.jpg',
    description: 'ベーシックな白Tシャツにデニム、ベージュのカーディガンで上品なカジュアルコーデ。',
    createdAt: new Date('2024-02-15')
  }
];

// 将来のコーディネート提案
export const mockIdeasFuture: IdeasFuture[] = [
  {
    id: 'ideas-future-1',
    userId: 'user-1',
    coordinationId: 'coord-2',
    items: [
      { closetItemId: 'closet-1', role: 'base' },
      { potentialBuyId: 'potential-1', role: 'main' },
      { potentialBuyId: 'potential-2', role: 'accent' }
    ],
    occasion: 'デート',
    season: '春',
    style: 'エレガントカジュアル',
    imageUrl: '/images/coordinations/date-look.jpg',
    description: '白Tシャツにブラックドレス、レッドのパンプスで華やかなデートコーデ。',
    createdAt: new Date('2024-02-15')
  }
];

// アクション履歴
export const mockActions: Action[] = [
  {
    id: 'action-1',
    userId: 'user-1',
    potentialBuyId: 'potential-1',
    decision: 'hold',
    reason: 'サイズを確認したい',
    comment: '試着してから決めたい',
    createdAt: new Date('2024-02-11')
  }
];

// フィードバック
export const mockFeedbacks: Feedback[] = [
  {
    id: 'feedback-1',
    userId: 'user-1',
    coordinationId: 'coord-1',
    type: 'ideas_now',
    rating: 'like',
    comment: 'とても気に入りました！',
    createdAt: new Date('2024-02-16')
  }
];

// コーディネート提案
export const mockCoordinationProposals: CoordinationProposal[] = [
  {
    id: 'coord-1',
    userId: 'user-1',
    type: 'ideas_now',
    items: [
      { id: 'closet-1', type: 'closet', role: 'base', imageUrl: '/images/closet/white-t-shirt.jpg' },
      { id: 'closet-2', type: 'closet', role: 'main', imageUrl: '/images/closet/blue-jeans.jpg' },
      { id: 'closet-3', type: 'closet', role: 'accent', imageUrl: '/images/closet/beige-cardigan.jpg' }
    ],
    occasion: '日常',
    season: '春',
    style: 'ナチュラルカジュアル',
    description: 'ベーシックな白Tシャツにデニム、ベージュのカーディガンで上品なカジュアルコーデ。',
    confidence: 0.85,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'coord-2',
    userId: 'user-1',
    type: 'ideas_future',
    items: [
      { id: 'closet-1', type: 'closet', role: 'base', imageUrl: '/images/closet/white-t-shirt.jpg' },
      { id: 'potential-1', type: 'potential_buy', role: 'main', imageUrl: '/images/potential/black-dress.jpg' },
      { id: 'potential-2', type: 'potential_buy', role: 'accent', imageUrl: '/images/potential/red-shoes.jpg' }
    ],
    occasion: 'デート',
    season: '春',
    style: 'エレガントカジュアル',
    description: '白Tシャツにブラックドレス、レッドのパンプスで華やかなデートコーデ。',
    confidence: 0.78,
    createdAt: new Date('2024-02-15')
  }
];