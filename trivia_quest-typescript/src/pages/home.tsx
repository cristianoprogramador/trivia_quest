import Lottie from "lottie-react";
import openingTrivia from "../assets/lotties/triviaopening.json";
import letsGoTrivia from "../assets/lotties/triviaGO.json";
import goingTrivia from "../assets/lotties/triviagoing.json";
import thinkTrivia from "../assets/lotties/triviathink.json";
import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { Settings } from "../components/settings";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const [step, setStep] = useState(1);
  const [goingTriviaLoading, setGoingTriviaLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const navigate = useNavigate();

  const [category, setCategory] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("any");
  const [questionType, setQuestionType] = useState<string>("any");

  const handleModalInfo = () => setModalInfo(true);

  const handleStartGame = async () => {
    const params = new URLSearchParams();
    params.append("amount", questionCount.toString());

    if (category !== 0) params.append("category", category.toString());
    if (difficulty !== "any") params.append("difficulty", difficulty);
    if (questionType !== "any") params.append("type", questionType);

    const url = `https://opentdb.com/api.php?${params.toString()}`;

    try {
      setGoingTriviaLoading(true);

      const response = await fetch(url);
      const data = await response.json();

      if (data.response_code === 0) {
        navigate("/game", { state: { questions: data.results } });
      } else {
        alert(
          "No questions found for the selected settings. Please try different settings."
        );
        setGoingTriviaLoading(false);
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      alert("An error occurred while fetching quiz data. Please try again.");
      setGoingTriviaLoading(false);
    }
  };

  useEffect(() => {
    const text = document.querySelector(".typing-text");
    if (text) {
      const letters = text?.textContent?.split("");
      text.textContent = "";
      letters?.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter === " " ? "\u00A0" : letter;
        span.style.animationDelay = `${index * 0.03}s`;
        span.classList.add("fade-in");
        text.appendChild(span);
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen w-full justify-between items-center bg-gradient-to-r from-blue-900 to-blue-600 relative">
      {step === 1 && (
        <div className="flex flex-col h-full gap-1 items-center justify-center w-full">
          <Lottie animationData={openingTrivia} loop={true} className="w-96" />
          <h1 className="text-3xl font-bold inline-flex flex-col lg:flex-row items-center gap-3">
            <span className="typing-text text-white">
              Let's play a Trivia Game?!
            </span>
            <Lottie
              animationData={letsGoTrivia}
              loop={true}
              className="w-20 cursor-pointer hover:opacity-65"
              onClick={() => setStep(2)}
            />
          </h1>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="absolute top-4 w-full flex justify-end px-6 text-white">
            <div
              className="flex flex-col gap-1 items-center cursor-pointer"
              onClick={handleModalInfo}
            >
              <IoSettingsOutline size={25} />
              <div>Settings</div>
            </div>
          </div>

          <div
            className="flex flex-col h-full gap-1 items-center justify-center w-full cursor-pointer"
            onClick={handleStartGame}
          >
            {!goingTriviaLoading && (
              <Lottie
                animationData={thinkTrivia}
                loop={true}
                className="w-96"
              />
            )}

            {goingTriviaLoading && (
              <Lottie
                animationData={goingTrivia}
                loop={true}
                className="w-96 cursor-pointer"
              />
            )}
            <h1 className="text-3xl font-bold inline-flex flex-row items-center gap-3">
              <span className="typing-text text-white">Click to Start</span>
            </h1>
          </div>
        </>
      )}

      <Settings
        modalInfo={modalInfo}
        setModalInfo={setModalInfo}
        category={category}
        setCategory={setCategory}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        questionType={questionType}
        setQuestionType={setQuestionType}
      />
    </main>
  );
}
