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
  // Generate a consistent color based on the name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500", 
      "bg-yellow-500",
      "bg-green-500",
      "bg-teal-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(fullName);

  return (
    <div
      className={`
        ${width} ${height} ${style}
        flex items-center justify-center
        rounded-full ${avatarColor} text-white font-semibold
        shadow-md border-2 border-white
        transition-all duration-200 hover:scale-105
      `}
    >
      {getInitials(fullName)}
    </div>
  );
};

export default CharacterAvatar;