import React from 'react';
import { Loader2 } from 'lucide-react';

export function QuizLoader({ topicName }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="bg-violet-100 p-6 rounded-full">
              <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Generating Your Quiz
          </h2>

          <p className="text-slate-600 leading-relaxed mb-2">
            AI is creating 5 unique questions about{' '}
            <span className="font-semibold text-violet-600">{topicName}</span>
          </p>

          <p className="text-sm text-slate-500">
            This may take a moment...
          </p>

          <div className="mt-8 flex justify-center gap-2">
            <div
              className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
