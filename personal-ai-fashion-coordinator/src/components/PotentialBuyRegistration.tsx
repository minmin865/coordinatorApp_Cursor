'use client';

import React, { useState, useRef } from 'react';
import { PotentialBuy, ImageAnalysisResult } from '@/types/database';
import { imageAnalyzer } from '@/lib/aiImageAnalysis';
import { Upload, X, Edit3, Check, Loader2 } from 'lucide-react';

interface PotentialBuyRegistrationProps {
  onSave: (potentialBuy: Omit<PotentialBuy, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<PotentialBuy>;
}

export default function PotentialBuyRegistration({ 
  onSave, 
  onCancel, 
  initialData 
}: PotentialBuyRegistrationProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || '');
  const [productUrl, setProductUrl] = useState<string>(initialData?.productUrl || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    category: initialData?.category || 'tops',
    color: initialData?.color || '',
    pattern: initialData?.pattern || '',
    material: initialData?.material || '',
    brand: initialData?.brand || '',
    price: initialData?.price || 0,
    size: initialData?.size || '',
    tags: initialData?.tags || [],
    status: initialData?.status || 'considering'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setIsAnalyzing(true);

    try {
      const result = await imageAnalyzer.analyzeImage(file);
      setAnalysisResult(result);
      setFormData(prev => ({
        ...prev,
        category: result.category,
        color: result.color,
        pattern: result.pattern,
        material: result.material || '',
        tags: result.tags
      }));
    } catch (error) {
      console.error('画像分析エラー:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlInput = async (url: string) => {
    setImageUrl(url);
    if (url) {
      setIsAnalyzing(true);
      try {
        const result = await imageAnalyzer.analyzeImageFromUrl(url);
        setAnalysisResult(result);
        setFormData(prev => ({
          ...prev,
          category: result.category,
          color: result.color,
          pattern: result.pattern,
          material: result.material || '',
          tags: result.tags
        }));
      } catch (error) {
        console.error('画像分析エラー:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleTagEdit = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      imageUrl,
      productUrl,
      category: formData.category as any,
      color: formData.color,
      pattern: formData.pattern,
      material: formData.material,
      brand: formData.brand,
      price: formData.price,
      size: formData.size,
      tags: formData.tags.filter(tag => tag.trim() !== ''),
      status: formData.status as any
    });
  };

  const categoryOptions = [
    { value: 'tops', label: 'トップス' },
    { value: 'bottoms', label: 'ボトムス' },
    { value: 'dresses', label: 'ドレス' },
    { value: 'outerwear', label: 'アウター' },
    { value: 'shoes', label: '靴' },
    { value: 'accessories', label: 'アクセサリー' },
    { value: 'bags', label: 'バッグ' },
    { value: 'jewelry', label: 'ジュエリー' }
  ];

  const statusOptions = [
    { value: 'considering', label: '検討中' },
    { value: 'decided', label: '決定' },
    { value: 'purchased', label: '購入済み' },
    { value: 'rejected', label: '却下' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        購入検討服の登録
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 画像アップロード */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            商品画像
          </label>
          
          {!imageUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  画像をアップロード
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  または
                </p>
                <input
                  type="url"
                  placeholder="画像URLを入力"
                  value={productUrl}
                  onChange={(e) => {
                    setProductUrl(e.target.value);
                    handleUrlInput(e.target.value);
                  }}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imageUrl}
                alt="商品画像"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl('');
                  setImageFile(null);
                  setAnalysisResult(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* AI分析結果 */}
        {isAnalyzing && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-700">AIが画像を分析中...</span>
          </div>
        )}

        {analysisResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-800">AI分析結果</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-green-600 hover:text-green-800"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">カテゴリ:</span>
                <span className="ml-2">{analysisResult.category}</span>
              </div>
              <div>
                <span className="font-medium">色:</span>
                <span className="ml-2">{analysisResult.color}</span>
              </div>
              <div>
                <span className="font-medium">柄:</span>
                <span className="ml-2">{analysisResult.pattern}</span>
              </div>
              <div>
                <span className="font-medium">素材:</span>
                <span className="ml-2">{analysisResult.material || '不明'}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">信頼度:</span>
                <span className="ml-2">{(analysisResult.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* 商品情報フォーム */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              色
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              柄
            </label>
            <input
              type="text"
              value={formData.pattern}
              onChange={(e) => setFormData(prev => ({ ...prev, pattern: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              素材
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ブランド
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              価格 (円)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サイズ
            </label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* タグ編集 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagEdit(index, e.target.value)}
                  className="bg-transparent border-none outline-none text-sm"
                  placeholder="タグを入力"
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm hover:bg-blue-200"
            >
              + タグを追加
            </button>
          </div>
        </div>

        {/* 商品URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品URL (任意)
          </label>
          <input
            type="url"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/product"
          />
        </div>

        {/* ボタン */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <Check className="h-4 w-4 mr-2" />
            保存
          </button>
        </div>
      </form>
    </div>
  );
}