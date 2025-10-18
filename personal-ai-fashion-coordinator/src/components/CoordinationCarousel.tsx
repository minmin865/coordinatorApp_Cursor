'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoordinationCarouselProps {
  coordinations: Array<{
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      imageUrl: string;
      name: string;
      role: 'main' | 'accent' | 'base';
    }>;
  }>;
  onBuyClick?: (coordinationId: string) => void;
  onFeedback?: (coordinationId: string, rating: 'like' | 'dislike' | 'neutral', comment?: string) => void;
}

export default function CoordinationCarousel({ 
  coordinations, 
  onBuyClick, 
  onFeedback 
}: CoordinationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ [key: string]: { rating: 'like' | 'dislike' | 'neutral', comment: string } }>({});

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % coordinations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + coordinations.length) % coordinations.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleFeedback = (coordinationId: string, rating: 'like' | 'dislike' | 'neutral') => {
    setFeedback(prev => ({
      ...prev,
      [coordinationId]: { ...prev[coordinationId], rating }
    }));
    onFeedback?.(coordinationId, rating, feedback[coordinationId]?.comment);
  };

  const handleCommentChange = (coordinationId: string, comment: string) => {
    setFeedback(prev => ({
      ...prev,
      [coordinationId]: { ...prev[coordinationId], comment }
    }));
  };

  const submitFeedback = (coordinationId: string) => {
    const currentFeedback = feedback[coordinationId];
    if (currentFeedback) {
      onFeedback?.(coordinationId, currentFeedback.rating, currentFeedback.comment);
    }
  };

  if (coordinations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">コーディネート提案がありません</p>
      </div>
    );
  }

  const currentCoordination = coordinations[currentIndex];
  const currentFeedback = feedback[currentCoordination.id];

  return (
    <div className="relative">
      {/* メインカルーセル */}
      <div className="relative overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <img
              src={currentCoordination.imageUrl}
              alt={currentCoordination.title}
              className="w-full h-96 object-cover"
            />
            
            {/* オーバーレイ情報 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-xl font-bold mb-2">
                {currentCoordination.title}
              </h3>
              <p className="text-white/90 text-sm">
                {currentCoordination.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ナビゲーションボタン */}
        {coordinations.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* ドットインジケーター */}
      {coordinations.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {coordinations.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-500 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* 使用アイテム一覧 */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">使用アイテム</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentCoordination.items.map((item) => (
            <div key={item.id} className="relative group">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-24 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-white text-xs text-center px-2">
                  {item.name}
                </span>
              </div>
              <div className="absolute top-1 left-1">
                <span className={`text-xs px-2 py-1 rounded-full text-white ${
                  item.role === 'main' ? 'bg-red-500' :
                  item.role === 'accent' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {item.role === 'main' ? 'メイン' : 
                   item.role === 'accent' ? 'アクセント' : 'ベース'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onBuyClick?.(currentCoordination.id)}
          className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          このコーデで買う？
        </button>
      </div>

      {/* フィードバックセクション */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">フィードバック</h4>
        
        {/* 評価ボタン */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => handleFeedback(currentCoordination.id, 'like')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentFeedback?.rating === 'like' 
                ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50'
            }`}
          >
            <span className="text-lg mr-2">👍</span>
            いいね
          </button>
          <button
            onClick={() => handleFeedback(currentCoordination.id, 'neutral')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentFeedback?.rating === 'neutral' 
                ? 'bg-gray-100 text-gray-700 border-2 border-gray-300' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg mr-2">😐</span>
            普通
          </button>
          <button
            onClick={() => handleFeedback(currentCoordination.id, 'dislike')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentFeedback?.rating === 'dislike' 
                ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-red-50'
            }`}
          >
            <span className="text-lg mr-2">👎</span>
            いまいち
          </button>
        </div>

        {/* コメント入力 */}
        <div className="space-y-2">
          <textarea
            value={currentFeedback?.comment || ''}
            onChange={(e) => handleCommentChange(currentCoordination.id, e.target.value)}
            placeholder="コメントを入力してください（任意）"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            onClick={() => submitFeedback(currentCoordination.id)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            フィードバックを送信
          </button>
        </div>
      </div>
    </div>
  );
}