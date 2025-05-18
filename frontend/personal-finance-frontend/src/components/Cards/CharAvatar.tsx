import { getInitials } from "../../utils/helper";

interface CharacterAvatarProps {
  fullName?: string;
  width?: string;
  height?: string;
  style?: string;
}

const CharacterAvatar = ({
  fullName = "",
  width = "w-12",
  height = "h-12",
  style = "",
}: CharacterAvatarProps) => {
  return (
    <div
      className={`
        ${width} ${height} ${style}
        flex items-center justify-center
        rounded-full bg-gray-100 text-gray-900 font-medium
      `}
    >
      {getInitials(fullName)}
    </div>
  );
};

export default CharacterAvatar;
