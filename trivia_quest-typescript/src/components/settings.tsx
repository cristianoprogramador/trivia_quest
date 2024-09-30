import { SetStateAction } from "react";
import ModalHeader from "./modalHeader";
import Modal from "./modal";

const categories = [
  { id: 0, name: "Any Category" },
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Entertainment: Books" },
  { id: 11, name: "Entertainment: Film" },
  { id: 12, name: "Entertainment: Music" },
  { id: 13, name: "Entertainment: Musicals & Theatres" },
  { id: 14, name: "Entertainment: Television" },
  { id: 15, name: "Entertainment: Video Games" },
  { id: 16, name: "Entertainment: Board Games" },
  { id: 17, name: "Science & Nature" },
  { id: 18, name: "Science: Computers" },
  { id: 19, name: "Science: Mathematics" },
  { id: 20, name: "Mythology" },
  { id: 21, name: "Sports" },
  { id: 22, name: "Geography" },
  { id: 23, name: "History" },
  { id: 24, name: "Politics" },
  { id: 25, name: "Art" },
  { id: 26, name: "Celebrities" },
  { id: 27, name: "Animals" },
  { id: 28, name: "Vehicles" },
  { id: 29, name: "Entertainment: Comics" },
  { id: 30, name: "Science: Gadgets" },
  { id: 31, name: "Entertainment: Japanese Anime & Manga" },
  { id: 32, name: "Entertainment: Cartoon & Animations" },
];

type SettingsProps = {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
  category: number;
  setCategory: (value: SetStateAction<number>) => void;
  questionCount: number;
  setQuestionCount: (value: SetStateAction<number>) => void;
  difficulty: string;
  setDifficulty: (value: SetStateAction<string>) => void;
  questionType: string;
  setQuestionType: (value: SetStateAction<string>) => void;
};

export function Settings({
  modalInfo,
  setModalInfo,
  category,
  setCategory,
  questionCount,
  setQuestionCount,
  difficulty,
  setDifficulty,
  questionType,
  setQuestionType,
}: SettingsProps) {
  const handleSaveSettings = () => {
    setModalInfo(false);
  };

  return (
    <Modal isOpen={modalInfo} setIsOpen={setModalInfo}>
      <ModalHeader
        onClose={() => setModalInfo(false)}
        title={"Game Settings"}
      />
      <div className="w-full mt-3 flex flex-col space-y-1.5 gap-1 rounded-lg items-center">
        <div className="flex flex-col justify-between gap-3">
          <label className="w-full">
            <span className="block mb-2 text-gray-700">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label className="w-full">
            <span className="block mb-2 text-gray-700">
              Number of Questions
            </span>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {[5, 10, 15, 20].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>

          <label className="w-full">
            <span className="block mb-2 text-gray-700">Difficulty</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="any">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label className="w-full">
            <span className="block mb-2 text-gray-700">Question Type</span>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="any">Any</option>
              <option value="multiple">Multiple Choice</option>
              <option value="boolean">True / False</option>
            </select>
          </label>

          <button
            onClick={handleSaveSettings}
            className="w-full bg-blue-600 text-white p-2 rounded-md mt-4"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  );
}
