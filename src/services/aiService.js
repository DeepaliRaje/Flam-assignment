const BACKEND_API_URL = 'http://localhost:5000'; // Node backend root

export async function generateQuizQuestions(topic) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/quiz?topic=${encodeURIComponent(topic)}`);
    if (!response.ok) throw new Error(`Backend error: ${response.status}`);

    const data = await response.json();
    if (!data.questions || !Array.isArray(data.questions))
      throw new Error('Invalid response format from backend');

    // Map each question so the answer matches the full option string
    return data.questions.map((q, index) => {
      const answerIndex = q.answer.charCodeAt(0) - 65; // 'A' => 0, 'B' => 1, etc.
      return {
        id: index,
        question: q.question,
        options: q.options,
        answer: q.options[answerIndex], // full option string
      };
    });
  } catch (err) {
    console.error('Error generating quiz questions:', err);
    throw new Error('Failed to generate quiz questions');
  }
}

export async function generateFeedback(topic, score, total) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, score, total }), // send data as expected by backend
    });

    if (!response.ok) throw new Error(`Backend error: ${response.status}`);

    const data = await response.json();
    // backend returns { feedback: "..." }
    return data.feedback || `Great effort! You scored ${score} out of ${total}. Keep learning!`;
  } catch (err) {
    console.error('Error generating feedback:', err);
    return `Great effort! You scored ${score} out of ${total}. Keep learning!`;
  }
}
