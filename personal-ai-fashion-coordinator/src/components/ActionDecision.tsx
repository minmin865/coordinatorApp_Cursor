'use client';

import React, { useState, useEffect } from 'react';
import { PotentialBuy, Action } from '@/types/database';
import { mockPotentialBuys, mockActions } from '@/lib/mockData';
import { Check, X, Clock, ShoppingCart, MessageSquare } from 'lucide-react';

interface ActionDecisionProps {
  userId: string;
  potentialBuyId?: string;
  onDecision?: (action: Omit<Action, 'id' | 'userId' | 'createdAt'>) => void;
  onBack?: () => void;
}

export default function ActionDecision({ 
  userId, 
  potentialBuyId, 
  onDecision, 
  onBack 
}: ActionDecisionProps) {
  const [potentialBuy, setPotentialBuy] = useState<PotentialBuy | null>(null);
  const [decision, setDecision] = useState<'buy' | 'hold' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionHistory, setActionHistory] = useState<Action[]>([]);

  useEffect(() => {
    // モックデータから購入検討アイテムを取得
    const item = potentialBuyId 
      ? mockPotentialBuys.find(pb => pb.id === potentialBuyId)
      : mockPotentialBuys[0]; // デフォルトで最初のアイテム
    
    if (item) {
      setPotentialBuy(item);
      // 既存のアクション履歴を取得
      const existingActions = mockActions.filter(action => action.potentialBuyId === item.id);
      setActionHistory(existingActions);
      
      // 既存のアクションがある場合はその決定を設定
      if (existingActions.length > 0) {
        const latestAction = existingActions[existingActions.length - 1];
        setDecision(latestAction.decision);
        setReason(latestAction.reason || '');
        setComment(latestAction.comment || '');
      }
    }
  }, [potentialBuyId]);

  const handleDecision = async (newDecision: 'buy' | 'hold' | 'reject') => {
    setDecision(newDecision);
  };

  const handleSubmit = async () => {
    if (!potentialBuy || !decision) return;

    setIsSubmitting(true);
    
    try {
      const actionData = {
        potentialBuyId: potentialBuy.id,
        decision,
        reason: reason.trim() || undefined,
        comment: comment.trim() || undefined
      };

      onDecision?.(actionData);
      
      // 実際の実装では、ここでAPIに送信
      console.log('アクション送信:', actionData);
      
      // 成功メッセージを表示（実際の実装では適切なフィードバックを表示）
      alert('決定が保存されました');
      
    } catch (error) {
      console.error('エラー:', error);
      alert('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDecisionIcon = (decisionType: 'buy' | 'hold' | 'reject') => {
    switch (decisionType) {
      case 'buy':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'hold':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'reject':
        return <X className="h-5 w-5 text-red-600" />;
    }
  };

  const getDecisionColor = (decisionType: 'buy' | 'hold' | 'reject') => {
    switch (decisionType) {
      case 'buy':
        return 'border-green-200 bg-green-50';
      case 'hold':
        return 'border-yellow-200 bg-yellow-50';
      case 'reject':
        return 'border-red-200 bg-red-50';
    }
  };

  const getDecisionText = (decisionType: 'buy' | 'hold' | 'reject') => {
    switch (decisionType) {
      case 'buy':
        return '買う';
      case 'hold':
        return '保留';
      case 'reject':
        return 'やめる';
    }
  };

  if (!potentialBuy) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">購入検討アイテムが見つかりません</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              戻る
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          購入判断
        </h1>
        <p className="text-gray-600">
          このアイテムについて最終的な判断を下してください
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 商品情報 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">商品情報</h2>
            
            <div className="space-y-4">
              <img
                src={potentialBuy.imageUrl}
                alt="商品画像"
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">カテゴリ:</span>
                  <span className="text-gray-600">{potentialBuy.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">色:</span>
                  <span className="text-gray-600">{potentialBuy.color}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">柄:</span>
                  <span className="text-gray-600">{potentialBuy.pattern}</span>
                </div>
                
                {potentialBuy.material && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">素材:</span>
                    <span className="text-gray-600">{potentialBuy.material}</span>
                  </div>
                )}
                
                {potentialBuy.brand && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">ブランド:</span>
                    <span className="text-gray-600">{potentialBuy.brand}</span>
                  </div>
                )}
                
                {potentialBuy.price && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">価格:</span>
                    <span className="text-gray-600">¥{potentialBuy.price.toLocaleString()}</span>
                  </div>
                )}
                
                {potentialBuy.size && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">サイズ:</span>
                    <span className="text-gray-600">{potentialBuy.size}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">ステータス:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    potentialBuy.status === 'considering' ? 'bg-yellow-100 text-yellow-800' :
                    potentialBuy.status === 'decided' ? 'bg-green-100 text-green-800' :
                    potentialBuy.status === 'purchased' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {potentialBuy.status === 'considering' ? '検討中' :
                     potentialBuy.status === 'decided' ? '決定' :
                     potentialBuy.status === 'purchased' ? '購入済み' : '却下'}
                  </span>
                </div>
              </div>
              
              {potentialBuy.tags.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700 block mb-2">タグ:</span>
                  <div className="flex flex-wrap gap-2">
                    {potentialBuy.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {potentialBuy.productUrl && (
                <div>
                  <a
                    href={potentialBuy.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    商品ページを見る
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* アクション履歴 */}
          {actionHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">アクション履歴</h3>
              <div className="space-y-3">
                {actionHistory.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getDecisionColor(action.decision)}`}>
                      {getDecisionIcon(action.decision)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">
                          {getDecisionText(action.decision)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(action.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {action.reason && (
                        <p className="text-sm text-gray-600 mt-1">理由: {action.reason}</p>
                      )}
                      {action.comment && (
                        <p className="text-sm text-gray-600 mt-1">コメント: {action.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 判断フォーム */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">判断を下す</h2>
            
            <div className="space-y-6">
              {/* 決定ボタン */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  このアイテムについてどうしますか？
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleDecision('buy')}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      decision === 'buy'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <Check className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">買う</div>
                      <div className="text-sm text-gray-500">このアイテムを購入する</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleDecision('hold')}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      decision === 'hold'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                    }`}
                  >
                    <Clock className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">保留</div>
                      <div className="text-sm text-gray-500">もう少し検討する</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleDecision('reject')}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      decision === 'reject'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <X className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">やめる</div>
                      <div className="text-sm text-gray-500">このアイテムは購入しない</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 理由入力 */}
              {decision && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    理由（任意）
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="判断の理由を入力してください"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* コメント入力 */}
              {decision && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    コメント（任意）
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="追加のコメントがあれば入力してください"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}

              {/* 送信ボタン */}
              {decision && (
                <div className="flex space-x-4">
                  {onBack && (
                    <button
                      onClick={onBack}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      戻る
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        判断を保存
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}