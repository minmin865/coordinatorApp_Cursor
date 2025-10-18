'use client';

import React, { useState, useEffect } from 'react';
import { CoordinationProposal as CoordinationProposalType, Ideal, IdeasNow, IdeasFuture } from '@/types/database';
import { mockCoordinationProposals, mockIdeal } from '@/lib/mockData';
import CoordinationCarousel from './CoordinationCarousel';
import { Heart, Star, Calendar, MapPin } from 'lucide-react';

interface CoordinationProposalProps {
  userId: string;
  onBuyClick?: (coordinationId: string) => void;
  onFeedback?: (coordinationId: string, rating: 'like' | 'dislike' | 'neutral', comment?: string) => void;
}

export default function CoordinationProposal({ 
  userId, 
  onBuyClick, 
  onFeedback 
}: CoordinationProposalProps) {
  const [activeTab, setActiveTab] = useState<'ideas_now' | 'ideas_future'>('ideas_now');
  const [coordinations, setCoordinations] = useState<CoordinationProposalType[]>([]);
  const [ideal, setIdeal] = useState<Ideal | null>(null);

  useEffect(() => {
    // モックデータを読み込み
    setCoordinations(mockCoordinationProposals);
    setIdeal(mockIdeal);
  }, []);

  const ideasNowCoordinations = coordinations.filter(c => c.type === 'ideas_now');
  const ideasFutureCoordinations = coordinations.filter(c => c.type === 'ideas_future');

  const currentCoordinations = activeTab === 'ideas_now' ? ideasNowCoordinations : ideasFutureCoordinations;

  const formatCoordinationsForCarousel = (coordinations: CoordinationProposalType[]) => {
    return coordinations.map(coord => ({
      id: coord.id,
      imageUrl: coord.imageUrl || '/images/placeholder-coordination.jpg',
      title: `${coord.style} - ${coord.occasion}`,
      description: coord.description,
      items: coord.items.map(item => ({
        id: item.id,
        imageUrl: item.imageUrl,
        name: `${item.type === 'closet' ? '手持ち' : '購入検討'}アイテム`,
        role: item.role
      }))
    }));
  };

  const handleBuyClick = (coordinationId: string) => {
    onBuyClick?.(coordinationId);
    // 実際の実装では、購入判断画面に遷移
    console.log('購入判断画面に遷移:', coordinationId);
  };

  const handleFeedback = (coordinationId: string, rating: 'like' | 'dislike' | 'neutral', comment?: string) => {
    onFeedback?.(coordinationId, rating, comment);
    // 実際の実装では、フィードバックをデータベースに保存
    console.log('フィードバック送信:', { coordinationId, rating, comment });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          コーディネート提案
        </h1>
        
        {/* 理想のスタイル表示 */}
        {ideal && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              あなたの理想のスタイル
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">スタイル方向性</h3>
                <p className="text-gray-600">{ideal.styleDirection}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">推奨カラーパレット</h3>
                <div className="flex flex-wrap gap-2">
                  {ideal.colorPalette.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white rounded-full text-sm border"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="font-medium text-gray-700 mb-2">キーアイテム</h3>
                <div className="flex flex-wrap gap-2">
                  {ideal.keyItems.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* タブ切り替え */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('ideas_now')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'ideas_now'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center">
              <Heart className="h-4 w-4 mr-2" />
              手持ち服でのコーデ
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ideas_future')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'ideas_future'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              購入検討服とのコーデ
            </div>
          </button>
        </div>
      </div>

      {/* コーディネート提案 */}
      {currentCoordinations.length > 0 ? (
        <CoordinationCarousel
          coordinations={formatCoordinationsForCarousel(currentCoordinations)}
          onBuyClick={handleBuyClick}
          onFeedback={handleFeedback}
        />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {activeTab === 'ideas_now' ? (
              <Heart className="h-16 w-16 mx-auto" />
            ) : (
              <Calendar className="h-16 w-16 mx-auto" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {activeTab === 'ideas_now' 
              ? '手持ち服でのコーディネート提案がありません' 
              : '購入検討服とのコーディネート提案がありません'
            }
          </h3>
          <p className="text-gray-500">
            {activeTab === 'ideas_now' 
              ? 'クローゼットにアイテムを追加してください' 
              : '購入検討服を登録してください'
            }
          </p>
        </div>
      )}

      {/* 統計情報 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">手持ち服コーデ</p>
              <p className="text-2xl font-bold text-gray-900">{ideasNowCoordinations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">購入検討コーデ</p>
              <p className="text-2xl font-bold text-gray-900">{ideasFutureCoordinations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総提案数</p>
              <p className="text-2xl font-bold text-gray-900">{coordinations.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}