import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import ThemeButton from "../../sharedItem/ThemeButton";
import Navbar from "../../sharedItem/Navbar";
import Lottie from "lottie-react";
import LoadingLottie from "../../assets/lottie/loading.json";

const AskBrainAi = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      setResponse(generatedText);
    } catch (err) {
      console.error("Error generating response:", err);
      setError("Failed to generate a response. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto mb-28 md:mb-6">
      <div className="min-h-screen flex flex-col items-center justify-start relative pt-24 md:pt-28">
        {/* Logo */}
        <h1 className="top-6 left-2 absolute text-3xl font-semibold">
          ✨ Brain AI
        </h1>

        <div className="flex flex-col items-center text-center max-w-3xl px-4 w-full">
          {/* Greeting */}
          {!response && (
            <>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                <span>Hello,</span>{" "}
                <span className="text-emerald-400">Boss.</span>
              </h1>
              <p className="text-gray-500 mt-2 text-xl md:text-2xl">
                How can I help you today?
              </p>
            </>
          )}

          {/* API Response */}
          <div className="mt-6 w-full max-w-5xl h-96 overflow-y-auto rounded-md p-4">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Lottie animationData={LoadingLottie} loop={true} />
              </div>
            ) : response && (
              <div className="whitespace-pre-wrap text-left">{response}</div>
            ) }
          </div>

          {/* Prompt Box */}
          <div className="mt-16 w-full max-w-2xl">
            <div className="flex items-center border rounded-full shadow-sm px-4 py-3">
              <input
                type="text"
                placeholder="Enter a prompt here"
                className="flex-1 bg-transparent outline-none placeholder-gray-400"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <button
                className="p-2 md:p-3 rounded-full bg-[#2A4759] text-white hover:bg-[#253b49] transition cursor-pointer"
                onClick={handleGenerate}
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-400 mt-4 px-4 max-w-xl leading-relaxed">
            Brain AI may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Brain AI Apps.
          </p>
        </div>
      </div>

      <Navbar />
      <ThemeButton />
    </div>
  );
};

export default AskBrainAi;
