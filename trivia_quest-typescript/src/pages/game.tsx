import { SetStateAction, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import he from "he";
import Lottie from "lottie-react";
import successTrivia from "../assets/lotties/triviasuccess.json";
import failureTrivia from "../assets/lotties/triviafailure.json";

export function GamePage() {
  const location = useLocation();
  const { questions } = location.state || {};
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showFailureAnimation, setShowFailureAnimation] = useState(false);

  useEffect(() => {
    if (questions && questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const correctAnswer = he.decode(currentQuestion.correct_answer);
      const incorrectAnswers = currentQuestion.incorrect_answers.map((ans: string) =>
        he.decode(ans)
      );

      let answersArray = [];

      if (currentQuestion.type === "boolean") {
        answersArray = ["True", "False"];
      } else {
        answersArray = [correctAnswer, ...incorrectAnswers];
      }

      setAnswers(answersArray);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = (answer: SetStateAction<string>) => {
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    setShowAnswerFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = he.decode(currentQuestion.correct_answer);

    if (selectedAnswer === correctAnswer) {
      setScore(score + 10);
      setShowSuccessAnimation(true);
    } else {
      setShowFailureAnimation(true);
    }

    setTimeout(() => {
      setShowSuccessAnimation(false);
      setShowFailureAnimation(false);
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setShowAnswerFeedback(false);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate("/", { state: { finalScore: score } });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <main className="flex min-h-screen w-full justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600">
        <h1 className="text-3xl font-bold text-white typing-text">
          No questions available. Please go back and try again.
        </h1>
      </main>
    );
  }

  const handleRestartQuiz = () => {
    navigate("/");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const questionText = he.decode(currentQuestion.question);
  const correctAnswer = he.decode(currentQuestion.correct_answer);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center bg-gradient-to-r from-blue-900 to-blue-600 p-4">
      <div className="text-white text-xl font-bold self-end">
        Score: {score}
      </div>
      <button
        onClick={handleRestartQuiz}
        className="bg-red-500 text-white px-4 py-2 rounded-md self-end mt-3"
      >
        Restart
      </button>
      <div className="text-white text-xl font-bold mt-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <h1 className="text-2xl font-bold text-white mt-4">
        {currentQuestion.category}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mt-4">
        <p className="text-gray-800 text-lg">{questionText}</p>
      </div>

      <div className="w-full max-w-2xl mt-4">
        {answers.map((answer, index) => {
          let buttonClass = "bg-white text-gray-800";

          if (selectedAnswer === answer) {
            if (!showAnswerFeedback) {
              buttonClass = "bg-blue-500 text-white";
            } else {
              if (answer === correctAnswer) {
                buttonClass = "bg-green-500 text-white";
              } else {
                buttonClass = "bg-blue-500 text-white";
              }
            }
          } else if (showAnswerFeedback && answer === correctAnswer) {
            buttonClass = "bg-green-500 text-white";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              disabled={showAnswerFeedback}
              className={`w-full p-2 mb-2 text-left rounded-md border ${buttonClass}`}
            >
              {answer}
            </button>
          );
        })}
      </div>

      {!showAnswerFeedback && selectedAnswer && (
        <button
          onClick={handleConfirmAnswer}
          className="mt-4 bg-blue-600 text-white p-2 rounded-md"
        >
          Confirm
        </button>
      )}

      {showAnswerFeedback && (
        <div className="mt-4">
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-blue-600 text-white p-2 rounded-md"
          >
            {currentQuestionIndex + 1 < questions.length
              ? "Next Question"
              : "Finish Quiz"}
          </button>
        </div>
      )}

      {showSuccessAnimation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Lottie
            animationData={successTrivia}
            loop={false}
            className="w-80 h-80"
          />
        </div>
      )}

      {showFailureAnimation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Lottie
            animationData={failureTrivia}
            loop={false}
            className="w-80 h-80"
          />
        </div>
      )}
    </main>
  );
}
