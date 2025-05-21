import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";
import { useState } from "react";

const EmojiPickerPopup = ({
  icon,
  onSelect,
}: {
  icon: string;
  onSelect: (icon: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(icon, "icon");
  return (
    <div className="relative inline-block">
      <div
        className="flex items-center gap-2 cursor-pointer text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon ? (
            <span className="text-2xl">{icon}</span>
        ) : (
          <LuImage className="w-6 h-6" />
        )}
        <p className="text-sm">{icon ? "Change Icon" : "Pick Icon"}</p>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white shadow-lg border border-gray-200 rounded">
          <div className="flex justify-end p-1">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-red-500"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
          <EmojiPicker
            onEmojiClick={(emoji) => {
              onSelect(emoji.emoji);
              setIsOpen(false);
            }}
            autoFocusSearch={false}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
