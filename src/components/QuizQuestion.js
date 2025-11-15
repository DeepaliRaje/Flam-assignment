import { ChevronLeft, ChevronRight } from "lucide-react";

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  onComplete,
  isLastQuestion,
}) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-violet-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => onSelectAnswer(option)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-violet-500 bg-violet-50 shadow-md"
                      : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "border-violet-500 bg-violet-500"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        isSelected ? "text-violet-900" : "text-slate-700"
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              canGoPrevious
                ? "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={onComplete}
              disabled={!selectedAnswer}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedAnswer
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Complete Quiz
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                canGoNext
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-md hover:shadow-lg"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

