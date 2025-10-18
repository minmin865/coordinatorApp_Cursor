'use client';

import React, { useState } from 'react';
import PotentialBuyRegistration from '@/components/PotentialBuyRegistration';
import CoordinationProposal from '@/components/CoordinationProposal';
import ActionDecision from '@/components/ActionDecision';
import { Plus, Heart, Calendar, CheckCircle, ShoppingCart } from 'lucide-react';

type ViewMode = 'home' | 'register' | 'proposals' | 'decisions';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPotentialBuyId, setSelectedPotentialBuyId] = useState<string | undefined>();

  const handleRegisterComplete = () => {
    setCurrentView('proposals');
  };

  const handleRegisterCancel = () => {
    setCurrentView('home');
  };

  const handleBuyClick = () => {
    setSelectedPotentialBuyId(undefined);
    setCurrentView('decisions');
  };

  const handleFeedback = (coordinationId: string, rating: 'like' | 'dislike' | 'neutral', comment?: string) => {
    console.log('フィードバック受信:', { coordinationId, rating, comment });
    // 実際の実装では、ここでフィードバックをデータベースに保存
  };

  const handleDecision = (action: { potentialBuyId: string; decision: string; reason?: string; comment?: string }) => {
    console.log('決定受信:', action);
    // 実際の実装では、ここでアクションをデータベースに保存
    setCurrentView('home');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'register') {
    return (
      <PotentialBuyRegistration
        onSave={handleRegisterComplete}
        onCancel={handleRegisterCancel}
      />
    );
  }

  if (currentView === 'proposals') {
    return (
      <CoordinationProposal
        userId="user-1"
        onBuyClick={handleBuyClick}
        onFeedback={handleFeedback}
      />
    );
  }

  if (currentView === 'decisions') {
    return (
      <ActionDecision
        userId="user-1"
        potentialBuyId={selectedPotentialBuyId}
        onDecision={handleDecision}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI パーソナルコーディネーター
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            あなたの理想のスタイルに合わせた、パーソナライズされたファッションコーディネートを提案します
          </p>
        </header>

        {/* メイン機能カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div 
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setCurrentView('register')}
          >
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                購入検討服を登録
              </h3>
              <p className="text-gray-600 text-sm">
                写真をアップロードしてAIが自動で服の属性を分析します
              </p>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setCurrentView('proposals')}
          >
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                コーディネート提案
              </h3>
              <p className="text-gray-600 text-sm">
                手持ち服や購入検討服を組み合わせたコーデを提案
              </p>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setCurrentView('decisions')}
          >
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                購入判断
              </h3>
              <p className="text-gray-600 text-sm">
                購入検討服について最終的な判断を記録
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                クローゼット管理
              </h3>
              <p className="text-gray-600 text-sm">
                手持ちの服を管理してコーデを最適化
              </p>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">手持ち服</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">購入検討中</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">今月の購入</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">最近のアクティビティ</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-600">新しいコーディネート提案が3件追加されました</p>
              <span className="text-sm text-gray-500">2時間前</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-gray-600">購入検討服「ブラックドレス」を登録しました</p>
              <span className="text-sm text-gray-500">1日前</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-gray-600">「ネイビーパンツ」の購入を決定しました</p>
              <span className="text-sm text-gray-500">3日前</span>
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentView('register')}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors mr-4"
          >
            新しい服を登録
          </button>
          <button
            onClick={() => setCurrentView('proposals')}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            コーディネートを見る
          </button>
        </div>
      </div>
    </div>
  );
}