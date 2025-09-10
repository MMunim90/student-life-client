import React, { useState } from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import Navbar from "../../sharedItem/Navbar";

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
  const [feedback, setFeedback] = useState({}); // AI feedback per question

  // Create a prompt for Gemini API
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

  // Fetch questions from Gemini
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

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

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

  // Handle option selection
  const handleSelect = (qIndex, option) => {
    if (!submitted) {
      setUserAnswers((prev) => ({ ...prev, [qIndex]: option }));
    }
  };

  // Get AI feedback for a single question
  const getFeedback = async (qIndex, q, userAnswer) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const prompt = `
      The question was: "${q.question}".
      The correct answer is: "${q.answer}".
      The student answered: "${userAnswer}".

      Give a short feedback (1-2 sentences) explaining if it's correct,
      and if not, a suggestion or learning tip.
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

  // Handle submission
  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError(null);
    setSubmitted(true);

    // Fetch AI feedback for all questions
    for (let i = 0; i < questions.length; i++) {
      await getFeedback(i, questions[i], userAnswers[i]);
    }
  };

  // Question Card
const QuestionCard = ({ q, idx }) => {
  const userAnswer = userAnswers[idx];
  const isCorrect = submitted && userAnswer === q.answer;

    return (
      <div className="border shadow-md rounded-lg p-5 border-l-4">
        <p className="font-semibold text-lg mb-3">
          {idx + 1}. {q.question}
        </p>

        {q.options && (
          <ul className="space-y-2 mb-3">
            {q.options.map((opt, i) => {
              const isSelected = userAnswer === opt;
              const showCorrect =
                submitted && q.answer === opt && !isSelected;

              return (
                <li
                  key={i}
                  onClick={() => handleSelect(idx, opt)}
                  className={`px-3 py-2 border rounded-md cursor-pointer ${
                    isSelected ? "bg-blue-100 border-blue-500 text-black" : ""
                  } ${
                    submitted
                      ? isCorrect
                        ? "border-green-500 bg-green-100 text-black"
                        : isSelected
                        ? "border-red-500 bg-red-100 text-black"
                        : showCorrect
                        ? "border-green-500 bg-green-50 text-black"
                        : ""
                      : ""
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
    <div className="min-h-screen mb-28 md:mb-6 mt-8 lg:mt-20">
      <main className="w-11/12 mx-auto py-8 md:py-12">
        <header className="text-start mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            📝 Exam Q&A Generator
          </h1>
          <p className="text-lg md:ml-20">
            Instantly create quiz questions for any subject with Brain AI.
          </p>
        </header>

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
                <option className="text-black" value="mcq">MCQ</option>
                <option className="text-black" value="truefalse">True/False</option>
                <option className="text-black" value="short">Short Answer</option>
              </select>
            </div>
            <div>
              <select
                id="difficulty-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2"
              >
                <option className="text-black" value="easy">Easy</option>
                <option className="text-black" value="medium">Medium</option>
                <option className="text-black" value="hard">Hard</option>
              </select>
            </div>
            <div>
              <input
                id="count-input"
                type="number"
                placeholder="number os qu"
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
                className="w-full bg-[#2A4759] hover:bg-[#253b49] text-white font-bold px-4 py-3 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "✨ Generate Questions"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Final Feedback */}
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

        {/* Questions Section */}
        <div className="space-y-4">
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

        {/* Submit Button */}
        {questions.length > 0 && !loading && !submitted && (
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-[#2A4759] hover:bg-[#253b49] text-white font-bold px-4 py-3 rounded-md"
          >
            Submit Answers
          </button>
        )}
      </main>

      <ThemeButton />
      <Navbar />
    </div>
  );
}