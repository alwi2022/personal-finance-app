import { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

interface ProfilePictureSelectorProps {
  image: File | null;
  setImage: (file: File | null) => void;
}

const ProfilePictureSelector: React.FC<ProfilePictureSelectorProps> = ({
  image,
  setImage,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div
          className="w-20 h-20 flex  items-center justify-center bg-purple-100 rounded-full relative"
        >
          <LuUser className="text-4xl text-primary" />
          <button type="button" className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute bottom-1 right-1 transition cursor-pointer" onClick={onChooseFile}>
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl as string}
            alt="Profile"
            className="w-20 h-20 object-cover rounded-full "
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 transition cursor-pointer"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureSelector;
