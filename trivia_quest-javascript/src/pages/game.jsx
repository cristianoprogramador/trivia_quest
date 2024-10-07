import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import he from "he";
import Lottie from "lottie-react";
import successTrivia from "../assets/lotties/triviasuccess.json";
import failureTrivia from "../assets/lotties/triviafailure.json";
import { PiRanking } from "react-icons/pi";
import { Rank } from "../components/rank";


export function GamePage() {
  const location = useLocation();
  const { questions, settings } = location.state || {};
  const navigate = useNavigate();
  const [modalRank, setModalRank] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [answerResult, setAnswerResult] = useState(null);

  const handleModalRank = () => setModalRank(true);

  useEffect(() => {
    if (questions && questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const decodedQuestion = decodeAndShuffleAnswers(currentQuestion);
      setAnswers(decodedQuestion);
    }
  }, [currentQuestionIndex, questions]);

  const decodeAndShuffleAnswers = (question) => {
    const correctAnswer = he.decode(question.correct_answer);
    const incorrectAnswers = question.incorrect_answers.map((answer) =>
      he.decode(answer)
    );

    const answersArray =
      question.type === "boolean"
        ? ["True", "False"]
        : [correctAnswer, ...incorrectAnswers];

    return shuffleArray(answersArray);
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = he.decode(currentQuestion.correct_answer);

    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setAnswerResult("success");
    } else {
      setAnswerResult("failure");
    }

    setTimeout(() => {
      setAnswerResult(null);
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      saveQuizHistory();
      navigate("/", { state: { finalScore: score } });
    }
  };

  const saveQuizHistory = () => {
    const existingHistory = JSON.parse(
      localStorage.getItem("quizHistory") || "[]"
    );
    const currentPlay = {
      timestamp: new Date().toISOString(),
      score: score,
      totalQuestions: questions.length,
      category: settings.category,
      difficulty: settings.difficulty,
      questionType: settings.questionType,
    };

    const updatedHistory = [...existingHistory, currentPlay];

    localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));
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
  const correctCategory = he.decode(currentQuestion.category);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center bg-gradient-to-r from-blue-900 to-blue-600 p-4">
      <div className="absolute top-4 w-full flex justify-start px-6 text-white">
        <div
          className="flex flex-col gap-1 items-center cursor-pointer"
          onClick={handleModalRank}
        >
          <PiRanking size={25} />
          <div>Rank</div>
        </div>
      </div>

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
        {correctCategory}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mt-4">
        <p className="text-gray-800 text-lg">{questionText}</p>
      </div>

      <div className="w-full max-w-2xl mt-4">
        {answers.map((answer, index) => {
          let buttonClass = "bg-white text-gray-800";

          if (selectedAnswer === answer) {
            buttonClass = "bg-blue-500 text-white";
          }

          if (answerResult && answer === correctAnswer) {
            buttonClass = "bg-green-500 text-white";
          } else if (
            answerResult &&
            answer === selectedAnswer &&
            selectedAnswer !== correctAnswer
          ) {
            buttonClass = "bg-red-500 text-white";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              disabled={!!answerResult}
              className={`w-full p-2 mb-2 text-left rounded-md border ${buttonClass}`}
            >
              {answer}
            </button>
          );
        })}
      </div>

      {!answerResult && selectedAnswer && (
        <button
          onClick={handleConfirmAnswer}
          className="mt-4 bg-blue-600 text-white p-2 rounded-md"
        >
          Confirm
        </button>
      )}

      {answerResult && (
        <div className="mt-4">
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-blue-600 text-white p-2 rounded-md"
          >
            {currentQuestionIndex + 1 < questions.length
              ? "Próxima Pergunta"
              : "Finalizar Quiz"}
          </button>
        </div>
      )}

      {answerResult === "success" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Lottie
            animationData={successTrivia}
            loop={false}
            className="w-80 h-80"
          />
        </div>
      )}

      {answerResult === "failure" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Lottie
            animationData={failureTrivia}
            loop={false}
            className="w-80 h-80"
          />
        </div>
      )}

      <Rank modalInfo={modalRank} setModalInfo={setModalRank} />
    </main>
  );
}
