import { SetStateAction, useEffect, useState } from "react";
import ModalHeader from "./modalHeader";
import Modal from "./modal";

type RankProps = {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
};

type PlayRecord = {
  timestamp: string;
  score: number;
  totalQuestions: number;
  category: number;
  difficulty: string;
  questionType: string;
};

export function Rank({ modalInfo, setModalInfo }: RankProps) {
  const [history, setHistory] = useState<PlayRecord[]>([]);

  useEffect(() => {
    if (modalInfo) {
      const storedHistory = JSON.parse(
        localStorage.getItem("quizHistory") || "[]"
      );
      setHistory(storedHistory);
    }
  }, [modalInfo]);

  function getCategoryName(categoryId: number): string {
    const categories: { [key: number]: string } = {
      0: "Any",
      9: "General Knowledge",
      10: "Entertainment: Books",
      11: "Entertainment: Film",
      12: "Entertainment: Music",
      13: "Entertainment: Musicals & Theatres",
      14: "Entertainment: Television",
      15: "Entertainment: Video Games",
      16: "Entertainment: Board Games",
      17: "Science & Nature",
      18: "Science: Computers",
      19: "Science: Mathematics",
      20: "Mythology",
      21: "Sports",
      22: "Geography",
      23: "History",
      24: "Politics",
      25: "Art",
      26: "Celebrities",
      27: "Animals",
      28: "Vehicles",
      29: "Entertainment: Comics",
      30: "Science: Gadgets",
      31: "Entertainment: Japanese Anime & Manga",
      32: "Entertainment: Cartoon & Animations",
    };
    return categories[categoryId] || "Unknown";
  }

  function capitalizeFirstLetter(string: string) {
    if (!string || string === "any") return "Any";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Modal isOpen={modalInfo} setIsOpen={setModalInfo}>
      <ModalHeader onClose={() => setModalInfo(false)} title={"Your Games"} />
      <div className="w-full mt-3 flex flex-col space-y-1.5 gap-1 rounded-lg items-center">
        <div className="flex flex-col justify-between gap-3 w-full overflow-x-auto">
          {history.length === 0 ? (
            <p>No plays recorded yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Score/Questions</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .slice()
                  .reverse()
                  .map((play, index) => (
                    <tr key={index} className="border-t text-center">
                      <td className="p-2">
                        {new Date(play.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2">
                        {play.score} / {play.totalQuestions}
                      </td>
                      <td className="p-2">{getCategoryName(play.category)}</td>
                      <td className="p-2">
                        {capitalizeFirstLetter(play.difficulty)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
}
