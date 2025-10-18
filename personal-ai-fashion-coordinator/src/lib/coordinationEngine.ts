import { 
  ClosetItem, 
  PotentialBuy, 
  Ideal, 
  CoordinationProposal, 
  User, 
  PhysicType, 
  FaceType, 
  PersonalColorType 
} from '@/types/database';

// コーディネート生成エンジン
export class CoordinationEngine {
  private user: User;
  private ideal: Ideal;
  private physicType: PhysicType;
  private faceType: FaceType;
  private personalColorType: PersonalColorType;

  constructor(
    user: User,
    ideal: Ideal,
    physicType: PhysicType,
    faceType: FaceType,
    personalColorType: PersonalColorType
  ) {
    this.user = user;
    this.ideal = ideal;
    this.physicType = physicType;
    this.faceType = faceType;
    this.personalColorType = personalColorType;
  }

  /**
   * 手持ち服でのコーディネートを生成
   */
  public generateIdeasNow(
    closetItems: ClosetItem[],
    occasion: string = '日常',
    season: string = '春'
  ): CoordinationProposal[] {
    const coordinations: CoordinationProposal[] = [];
    
    // カテゴリ別にアイテムを分類
    const itemsByCategory = this.categorizeItems(closetItems);
    
    // 基本のコーディネートパターンを生成
    const patterns = this.getCoordinationPatterns(occasion, season);
    
    for (const pattern of patterns) {
      const coordination = this.createCoordination(
        pattern,
        itemsByCategory,
        'ideas_now',
        occasion,
        season
      );
      
      if (coordination) {
        coordinations.push(coordination);
      }
    }
    
    return coordinations;
  }

  /**
   * 購入検討服とのコーディネートを生成
   */
  public generateIdeasFuture(
    closetItems: ClosetItem[],
    potentialBuys: PotentialBuy[],
    occasion: string = '日常',
    season: string = '春'
  ): CoordinationProposal[] {
    const coordinations: CoordinationProposal[] = [];
    
    // カテゴリ別にアイテムを分類
    const closetItemsByCategory = this.categorizeItems(closetItems);
    const potentialBuysByCategory = this.categorizePotentialBuys(potentialBuys);
    
    // 購入検討服を中心としたコーディネートパターンを生成
    const patterns = this.getFutureCoordinationPatterns(occasion, season);
    
    for (const pattern of patterns) {
      const coordination = this.createFutureCoordination(
        pattern,
        closetItemsByCategory,
        potentialBuysByCategory,
        occasion,
        season
      );
      
      if (coordination) {
        coordinations.push(coordination);
      }
    }
    
    return coordinations;
  }

  /**
   * アイテムをカテゴリ別に分類
   */
  private categorizeItems(items: ClosetItem[]): { [key: string]: ClosetItem[] } {
    const categorized: { [key: string]: ClosetItem[] } = {};
    
    items.forEach(item => {
      if (!categorized[item.category]) {
        categorized[item.category] = [];
      }
      categorized[item.category].push(item);
    });
    
    return categorized;
  }

  /**
   * 購入検討アイテムをカテゴリ別に分類
   */
  private categorizePotentialBuys(items: PotentialBuy[]): { [key: string]: PotentialBuy[] } {
    const categorized: { [key: string]: PotentialBuy[] } = {};
    
    items.forEach(item => {
      if (!categorized[item.category]) {
        categorized[item.category] = [];
      }
      categorized[item.category].push(item);
    });
    
    return categorized;
  }

  /**
   * コーディネーションパターンを取得
   */
  private getCoordinationPatterns(occasion: string, season: string): CoordinationPattern[] {
    const patterns: CoordinationPattern[] = [];
    
    // 基本パターン
    patterns.push({
      name: 'ベーシックカジュアル',
      style: 'カジュアル',
      items: [
        { category: 'tops', role: 'base', required: true },
        { category: 'bottoms', role: 'main', required: true },
        { category: 'outerwear', role: 'accent', required: false },
        { category: 'shoes', role: 'accent', required: false }
      ],
      colorHarmony: 'neutral',
      priority: 1
    });

    // シーズン別パターン
    if (season === '春' || season === '夏') {
      patterns.push({
        name: 'ライトスタイル',
        style: 'ナチュラル',
        items: [
          { category: 'tops', role: 'base', required: true },
          { category: 'bottoms', role: 'main', required: true },
          { category: 'accessories', role: 'accent', required: false }
        ],
        colorHarmony: 'light',
        priority: 2
      });
    }

    // オケージョン別パターン
    if (occasion === 'デート' || occasion === 'パーティー') {
      patterns.push({
        name: 'エレガント',
        style: 'エレガント',
        items: [
          { category: 'dresses', role: 'main', required: true },
          { category: 'shoes', role: 'accent', required: true },
          { category: 'accessories', role: 'accent', required: false }
        ],
        colorHarmony: 'elegant',
        priority: 1
      });
    }

    return patterns.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 将来のコーディネーションパターンを取得
   */
  private getFutureCoordinationPatterns(occasion: string, season: string): CoordinationPattern[] {
    const patterns: CoordinationPattern[] = [];
    
    // 購入検討服を中心としたパターン
    patterns.push({
      name: '新アイテム中心',
      style: 'ミックス',
      items: [
        { category: 'tops', role: 'base', required: true, preferNew: true },
        { category: 'bottoms', role: 'main', required: true, preferNew: true },
        { category: 'outerwear', role: 'accent', required: false },
        { category: 'shoes', role: 'accent', required: false }
      ],
      colorHarmony: 'mixed',
      priority: 1
    });

    return patterns;
  }

  /**
   * コーディネーションを作成
   */
  private createCoordination(
    pattern: CoordinationPattern,
    itemsByCategory: { [key: string]: ClosetItem[] },
    type: 'ideas_now' | 'ideas_future',
    _occasion: string,
    _season: string
  ): CoordinationProposal | null {
    const selectedItems: Array<{
      id: string;
      type: 'closet' | 'potential_buy';
      role: 'main' | 'accent' | 'base';
      imageUrl: string;
    }> = [];

    let totalScore = 0;
    let requiredItemsFound = 0;

    // パターンに従ってアイテムを選択
    for (const itemPattern of pattern.items) {
      const categoryItems = itemsByCategory[itemPattern.category] || [];
      
      if (categoryItems.length === 0) {
        if (itemPattern.required) {
          return null; // 必須アイテムが見つからない
        }
        continue;
      }

      // 最適なアイテムを選択
      const bestItem = this.selectBestItem(categoryItems, itemPattern.role, pattern.colorHarmony);
      
      if (bestItem) {
        selectedItems.push({
          id: bestItem.id,
          type: 'closet',
          role: itemPattern.role,
          imageUrl: bestItem.imageUrl
        });
        
        totalScore += this.calculateItemScore(bestItem, itemPattern.role, pattern.colorHarmony);
        requiredItemsFound++;
      }
    }

    // 必須アイテムが揃わない場合はnullを返す
    const requiredItems = pattern.items.filter(item => item.required).length;
    if (requiredItemsFound < requiredItems) {
      return null;
    }

    // コーディネーションの信頼度を計算
    const confidence = Math.min(totalScore / (pattern.items.length * 10), 1.0);

    return {
      id: `coord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: this.user.id,
      type,
      items: selectedItems,
      occasion,
      season,
      style: pattern.style,
      description: this.generateDescription(selectedItems, pattern.style, occasion),
      confidence,
      createdAt: new Date()
    };
  }

  /**
   * 将来のコーディネーションを作成
   */
  private createFutureCoordination(
    pattern: CoordinationPattern,
    closetItemsByCategory: { [key: string]: ClosetItem[] },
    potentialBuysByCategory: { [key: string]: PotentialBuy[] },
    _occasion: string,
    _season: string
  ): CoordinationProposal | null {
    const selectedItems: Array<{
      id: string;
      type: 'closet' | 'potential_buy';
      role: 'main' | 'accent' | 'base';
      imageUrl: string;
    }> = [];

    let totalScore = 0;
    let requiredItemsFound = 0;

    // パターンに従ってアイテムを選択
    for (const itemPattern of pattern.items) {
      let bestItem: ClosetItem | PotentialBuy | null = null;
      let itemType: 'closet' | 'potential_buy' = 'closet';

      // 新アイテムを優先する場合
      if (itemPattern.preferNew) {
        const potentialItems = potentialBuysByCategory[itemPattern.category] || [];
        if (potentialItems.length > 0) {
          bestItem = this.selectBestPotentialItem(potentialItems, itemPattern.role, pattern.colorHarmony);
          itemType = 'potential_buy';
        }
      }

      // 新アイテムが見つからない場合は手持ちアイテムから選択
      if (!bestItem) {
        const closetItems = closetItemsByCategory[itemPattern.category] || [];
        if (closetItems.length > 0) {
          bestItem = this.selectBestItem(closetItems, itemPattern.role, pattern.colorHarmony);
          itemType = 'closet';
        }
      }

      if (bestItem) {
        selectedItems.push({
          id: bestItem.id,
          type: itemType,
          role: itemPattern.role,
          imageUrl: bestItem.imageUrl
        });
        
        totalScore += this.calculateItemScore(bestItem, itemPattern.role, pattern.colorHarmony);
        requiredItemsFound++;
      }
    }

    // 必須アイテムが揃わない場合はnullを返す
    const requiredItems = pattern.items.filter(item => item.required).length;
    if (requiredItemsFound < requiredItems) {
      return null;
    }

    // コーディネーションの信頼度を計算
    const confidence = Math.min(totalScore / (pattern.items.length * 10), 1.0);

    return {
      id: `coord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: this.user.id,
      type: 'ideas_future',
      items: selectedItems,
      occasion,
      season,
      style: pattern.style,
      description: this.generateDescription(selectedItems, pattern.style, occasion),
      confidence,
      createdAt: new Date()
    };
  }

  /**
   * 最適なアイテムを選択
   */
  private selectBestItem(
    items: ClosetItem[],
    role: 'main' | 'accent' | 'base',
    colorHarmony: string
  ): ClosetItem | null {
    if (items.length === 0) return null;

    // スコアが最も高いアイテムを選択
    let bestItem = items[0];
    let bestScore = this.calculateItemScore(items[0], role, colorHarmony);

    for (let i = 1; i < items.length; i++) {
      const score = this.calculateItemScore(items[i], role, colorHarmony);
      if (score > bestScore) {
        bestItem = items[i];
        bestScore = score;
      }
    }

    return bestItem;
  }

  /**
   * 最適な購入検討アイテムを選択
   */
  private selectBestPotentialItem(
    items: PotentialBuy[],
    role: 'main' | 'accent' | 'base',
    colorHarmony: string
  ): PotentialBuy | null {
    if (items.length === 0) return null;

    // スコアが最も高いアイテムを選択
    let bestItem = items[0];
    let bestScore = this.calculateItemScore(items[0], role, colorHarmony);

    for (let i = 1; i < items.length; i++) {
      const score = this.calculateItemScore(items[i], role, colorHarmony);
      if (score > bestScore) {
        bestItem = items[i];
        bestScore = score;
      }
    }

    return bestItem;
  }

  /**
   * アイテムのスコアを計算
   */
  private calculateItemScore(
    item: ClosetItem | PotentialBuy,
    role: 'main' | 'accent' | 'base',
    colorHarmony: string
  ): number {
    let score = 0;

    // 色の適合性
    if (this.ideal.colorPalette.includes(item.color)) {
      score += 3;
    }

    // パーソナルカラータイプとの適合性
    if (this.personalColorType.recommendedColors.includes(item.color)) {
      score += 2;
    }

    // ロールとの適合性
    switch (role) {
      case 'main':
        if (['tops', 'dresses'].includes(item.category)) {
          score += 2;
        }
        break;
      case 'accent':
        if (['shoes', 'accessories', 'bags'].includes(item.category)) {
          score += 2;
        }
        break;
      case 'base':
        if (['tops', 'bottoms'].includes(item.category)) {
          score += 2;
        }
        break;
    }

    // お気に入りアイテムのボーナス
    if ('isFavorite' in item && item.isFavorite) {
      score += 1;
    }

    // 色調和の適合性
    score += this.calculateColorHarmonyScore(item.color, colorHarmony);

    return score;
  }

  /**
   * 色調和スコアを計算
   */
  private calculateColorHarmonyScore(color: string, harmony: string): number {
    // 簡易的な色調和計算
    switch (harmony) {
      case 'neutral':
        return ['ホワイト', 'ブラック', 'グレー', 'ベージュ'].includes(color) ? 2 : 0;
      case 'light':
        return ['ホワイト', 'ベージュ', 'ピンク', 'ライトブルー'].includes(color) ? 2 : 0;
      case 'elegant':
        return ['ブラック', 'ネイビー', 'ホワイト', 'レッド'].includes(color) ? 2 : 0;
      default:
        return 1;
    }
  }

  /**
   * コーディネーションの説明を生成
   */
  private generateDescription(
    items: Array<{ id: string; type: 'closet' | 'potential_buy'; role: string; imageUrl: string }>,
    style: string,
    occasion: string
  ): string {
    const mainItems = items.filter(item => item.role === 'main');
    const accentItems = items.filter(item => item.role === 'accent');
    
    let description = `${occasion}にぴったりの${style}コーディネート。`;
    
    if (mainItems.length > 0) {
      description += `メインアイテムを中心に、`;
    }
    
    if (accentItems.length > 0) {
      description += `アクセントアイテムで華やかさをプラス。`;
    }
    
    description += `あなたの理想のスタイルに合った上品な仕上がりです。`;
    
    return description;
  }
}

// コーディネーションパターンの型定義
interface CoordinationPattern {
  name: string;
  style: string;
  items: Array<{
    category: string;
    role: 'main' | 'accent' | 'base';
    required: boolean;
    preferNew?: boolean;
  }>;
  colorHarmony: string;
  priority: number;
}

// コーディネーション生成サービスのファクトリー
export class CoordinationService {
  public static createEngine(
    user: User,
    ideal: Ideal,
    physicType: PhysicType,
    faceType: FaceType,
    personalColorType: PersonalColorType
  ): CoordinationEngine {
    return new CoordinationEngine(user, ideal, physicType, faceType, personalColorType);
  }
}