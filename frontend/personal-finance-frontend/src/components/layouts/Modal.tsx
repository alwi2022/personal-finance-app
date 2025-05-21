import { LuX } from "react-icons/lu";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0  z-50 flex items-center justify-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/30 bg-opacity-50">
      <div className="relative w-full max-w-2xl p-4 max-h-full">

        <div className=" relative bg-white rounded-lg dark:bg-gray-700 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent dark:hover:bg-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:text-white cursor-pointer"
            >
            <LuX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
