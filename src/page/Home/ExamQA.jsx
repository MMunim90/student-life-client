import React, { useEffect, useState } from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import Navbar from "../../sharedItem/Navbar";
import Swal from "sweetalert2";

export default function App() {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("mcq");
  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeUp, setTimeUp] = useState(false);

  // 🆕 History state
  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🆕 Load history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("examHistory")) || [];
    setHistory(savedHistory);
  }, []);

  // Timer useEffect
  useEffect(() => {
    if (questions.length === 0) return;

    setTimeLeft(questions.length * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeUp(true);
          const allAnswered =
            Object.keys(userAnswers).length === questions.length;
          if (!submitted) {
            if (!allAnswered) {
              Swal.fire({
                icon: "error",
                title: "⏰ Time's up!",
                text: "Reload Page to Generate New Questions",
              });
            } else {
              handleSubmit(true);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, userAnswers]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const generatePrompt = () => {
    let questionTypeDetails = "";
    switch (type) {
      case "mcq":
        questionTypeDetails = "multiple-choice questions with 4 options each.";
        break;
      case "truefalse":
        questionTypeDetails = "true/false questions.";
        break;
      case "short":
        questionTypeDetails =
          "short answer questions where the answer is a brief phrase or sentence.";
        break;
      default:
        questionTypeDetails = "questions.";
    }

    return `
      Generate ${count} ${difficulty} ${questionTypeDetails}
      on the subject of "${subject}".

      For each question, provide:
      - A 'question' text.
      - For MCQs, an array of 4 'options'.
      - The correct 'answer'.

      The final output must be a valid JSON array of objects.
    `;
  };

  const generateQuestions = async () => {
    if (!subject) {
      setError("Please enter a subject or topic.");
      return;
    }
    if (count <= 0) {
      setError("Please enter a valid number of questions.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    setFeedback({});
    setTimeUp(false);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const questionSchema = {
      type: "OBJECT",
      properties: {
        question: { type: "STRING" },
        options: { type: "ARRAY", items: { type: "STRING" } },
        answer: { type: "STRING" },
      },
      required: ["question", "answer"],
    };

    const payload = {
      contents: [{ parts: [{ text: generatePrompt() }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: questionSchema,
        },
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        const parsedQuestions = JSON.parse(generatedText);
        setQuestions(parsedQuestions);
      } else {
        throw new Error("No content received from the API.");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(
        "Failed to generate questions. Please check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, option) => {
    if (!submitted) {
      setUserAnswers((prev) => ({ ...prev, [qIndex]: option }));
    }
  };

  const getFeedback = async (qIndex, q, userAnswer) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      The question was: "${q.question}".
      The correct answer is: "${q.answer}".
      The student answered: "${userAnswer}".
      Give short feedback (1-2 sentences).
    `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setFeedback((prev) => ({ ...prev, [qIndex]: text }));
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  // 🆕 handleSubmit with history saving
  const handleSubmit = async () => {
    const allAnswered = Object.keys(userAnswers).length === questions.length;
    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setError(null);
    setSubmitted(true);

    let correctCount = 0;
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].answer) correctCount++;
      await getFeedback(i, questions[i], userAnswers[i]);
    }

    const wrongCount = questions.length - correctCount;

    const newResult = {
      topic: subject,
      type,
      difficulty,
      totalQuestions: questions.length,
      correct: correctCount,
      wrong: wrongCount,
      finishTime: new Date().toLocaleString(),
    };

    const updatedHistory = [newResult, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("examHistory", JSON.stringify(updatedHistory));
  };

  const QuestionCard = ({ q, idx }) => {
    const userAnswer = userAnswers[idx];
    const isCorrect = submitted && userAnswer === q.answer;
    const disableClick = submitted || timeUp;

    return (
      <div className="border shadow-md rounded-lg p-5 border-l-4">
        <p className="font-semibold text-lg mb-3">
          {idx + 1}. {q.question}
        </p>
        {q.options && (
          <ul className="space-y-2 mb-3">
            {q.options.map((opt, i) => {
              const isSelected = userAnswer === opt;
              const showCorrect = submitted && q.answer === opt && !isSelected;
              return (
                <li
                  key={i}
                  onClick={() => !disableClick && handleSelect(idx, opt)}
                  className={`px-3 py-2 border rounded-md cursor-pointer ${
                    isSelected ? "bg-blue-100 border-blue-500 text-black" : ""
                  } ${
                    submitted
                      ? isCorrect && isSelected
                        ? "bg-green-100 border-green-500"
                        : isSelected
                        ? "border-red-500 bg-red-100"
                        : showCorrect
                        ? "border-green-500 bg-green-50 text-black"
                        : ""
                      : ""
                  } ${
                    timeUp && !submitted ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {opt}
                </li>
              );
            })}
          </ul>
        )}

        {submitted && (
          <>
            <p
              className={`mt-2 font-medium ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "✅ Correct!" : `❌ Incorrect. Answer: ${q.answer}`}
            </p>
            {feedback[idx] && (
              <p className="mt-2 text-sm text-gray-700 bg-gray-100 rounded-md p-2">
                💡 {feedback[idx]}
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="min-h-screen mb-28 md:mb-6 mt-8 lg:mt-20 relative">
        <main className="w-11/12 mx-auto py-8 md:py-12">
          <header className="text-start mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              📝 Exam Q&A Generator
            </h1>
            <p className="text-lg md:ml-12">
              Instantly create quiz questions for any subject with Brain AI.
            </p>
          </header>

          {questions.length > 0 && !submitted && (
            <div className="text-center mb-4 text-lg font-semibold text-blue-600">
              ⏱ Time Left: {formatTime(timeLeft)}
            </div>
          )}

          {/* Input Section */}
          <div className="border rounded-lg p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-2">
                <input
                  id="subject-input"
                  type="text"
                  placeholder="e.g., 'World War II' or 'React Hooks'"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <select
                  id="type-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                >
                  <option className="text-black" value="mcq">
                    MCQ
                  </option>
                  <option className="text-black" value="truefalse">
                    True/False
                  </option>
                  <option className="text-black" value="short">
                    Short Answer
                  </option>
                </select>
              </div>
              <div>
                <select
                  id="difficulty-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                >
                  <option className="text-black" value="easy">
                    Easy
                  </option>
                  <option className="text-black" value="medium">
                    Medium
                  </option>
                  <option className="text-black" value="hard">
                    Hard
                  </option>
                </select>
              </div>
              <div>
                <input
                  id="count-input"
                  type="number"
                  placeholder="No. of Questions"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div className="lg:col-span-5">
                <button
                  onClick={generateQuestions}
                  disabled={loading}
                  className="w-full bg-[#2A4759] hover:bg-[#253b49] text-white font-bold px-4 py-3 rounded-md transition duration-300 disabled:bg-gray-400 cursor-pointer"
                >
                  {loading ? "Generating..." : "✨ Generate Questions"}
                </button>
              </div>
            </div>
          </div>

          {/* Result Summary */}
          {submitted && (
            <div className="mb-6 text-center space-y-4">
              <h2 className="text-xl font-bold">
                🎉 You scored{" "}
                {
                  Object.keys(userAnswers).filter(
                    (i) => userAnswers[i] === questions[i].answer
                  ).length
                }{" "}
                / {questions.length}
              </h2>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-4 mb-6">
            {questions.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-10">
                <p className="text-xl">
                  Your generated quiz questions will appear here.
                </p>
              </div>
            )}
            {questions.map((q, idx) => (
              <QuestionCard q={q} idx={idx} key={idx} />
            ))}
          </div>

          {/* Submit or Reload */}
          {questions.length > 0 && !loading && !submitted && (
            <div className="mt-6 space-y-2">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-center">
                  {error}
                </div>
              )}

              {timeUp ? (
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-md cursor-pointer"
                >
                  🔄 Reload Page
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#2A4759] hover:bg-[#253b49] text-white font-bold px-4 py-3 rounded-md cursor-pointer"
                >
                  Submit Answers
                </button>
              )}
            </div>
          )}
        </main>

        {/* 🆕 Floating Button for Drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed right-6 bottom-28 md:bottom-6 z-50 bg-[#2A4759] hover:bg-[#253b49] text-white font-bold py-3 px-5 rounded-full shadow-lg cursor-pointer"
        >
          📜 History
        </button>

        {/* 🆕 Drawer */}
        {drawerOpen && (
          <>
            {/* Overlay (click to close) */}
            <div
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/30 bg-opacity-30 z-40"
            ></div>

            {/* Drawer */}
            <div
              className="fixed top-0 right-0 w-80 h-full bg-gray-50 shadow-2xl border-l border-gray-300 z-50 p-5 overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Exam History</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-gray-500 hover:text-black text-lg cursor-pointer"
                >
                  ✖
                </button>
              </div>

              {history.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  No exam history yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {history.map((h, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 bg-gray-50 shadow-2xl"
                    >
                      <p className="font-semibold text-lg text-black">
                        {h.topic}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {h.type} | {h.difficulty}
                      </p>
                      <p className="mt-2 text-sm text-black">
                        Questions: {h.totalQuestions}
                      </p>
                      <p className="text-green-600 text-sm">
                        ✅ Correct: {h.correct}
                      </p>
                      <p className="text-red-600 text-sm">
                        ❌ Wrong: {h.wrong}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Finished: {h.finishTime}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ThemeButton />
      <Navbar />
    </div>
  );
}
