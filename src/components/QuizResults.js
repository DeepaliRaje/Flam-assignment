import { Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";

export function QuizResults({
  topicName,
  questions,
  answers,
  score,
  feedback,
  onRestart,
}) {
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-blue-100";
    if (percentage >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className={`inline-flex p-6 rounded-full ${getScoreBgColor()} mb-6`}>
            <Trophy className={`w-16 h-16 ${getScoreColor()}`} />
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-3">Quiz Complete!</h1>
          <p className="text-lg text-slate-600 mb-6">{topicName}</p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <div className={`text-6xl font-bold ${getScoreColor()}`}>
                {score}/{total}
              </div>
              <div className="text-sm text-slate-500 mt-2">Correct Answers</div>
            </div>

            <div className="w-px h-20 bg-slate-200"></div>

            <div>
              <div className={`text-6xl font-bold ${getScoreColor()}`}>
                {percentage}%
              </div>
              <div className="text-sm text-slate-500 mt-2">Score</div>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-violet-50 rounded-xl p-6 mb-6">
            <p className="text-lg text-slate-700 leading-relaxed">{feedback}</p>
          </div>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Take Another Quiz
          </button>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Review Your Answers
          </h2>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id]; // use index instead of id
              const correctAnswer = question.answer;
              const isCorrect = userAnswer === correctAnswer;

              return (
                <div
                  key={index} // use index instead of id
                  className={`border-2 rounded-xl p-6 ${
                    isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-semibold text-slate-900 text-lg">
                          Question {index + 1}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>

                      <p className="text-slate-700 mb-4">{question.question}</p>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-slate-600">
                            Your answer:
                          </span>
                          <span className={`ml-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                            {userAnswer || "Not answered"}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div>
                            <span className="text-sm font-medium text-slate-600">
                              Correct answer:
                            </span>
                            <span className="ml-2 text-green-700 font-medium">{correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
