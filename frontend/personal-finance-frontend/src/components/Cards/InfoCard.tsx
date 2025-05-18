interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const InfoCard = ({ icon, label, value, color }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-md shadow-gray-100 border border-gray-200/50">
      <div className={`w-14 h-14 flex items-center justify-center text-white text-[26px] rounded-full ${color} drop-shadow-xl`}>
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
        <span className="text-xl font-semibold">{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
