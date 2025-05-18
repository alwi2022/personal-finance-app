import CARD_2 from "../../assets/image/expanste.tracker.png"; // Periksa nama file yang benar
import type { AuthLayoutProps } from "../../types/type";
import { LuTrendingUpDown } from "react-icons/lu";
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex">
      {/* Kiri: Form login */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 bg-white">
        <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
        {children}
      </div>

      {/* Kanan: Ilustrasi dan dekorasi */}
      <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        {/* Kotak dekorasi */}
        <div className="w-48 h-48 bg-purple-600 rounded-[40px] absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10" />
        <div className="w-48 h-48 bg-violet-500 rounded-[40px] absolute -bottom-7 -right-5" />
        <div className="grid grid-cols-1 z-10">
          <StatsInfoCard icons={<LuTrendingUpDown />} label="Track Your income and expenses" value="430.000" color="bg-primary" />
        </div>
        {/* Gambar utama */}
        <img
          src={CARD_2}
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"
          alt="Expense tracker illustration"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

interface StatsInfoCardProps {
  icons: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatsInfoCard = ({ icons, label, value, color }: StatsInfoCardProps) => {
  return (
    <div className="flex gap-6 bg-white rounded-xl p-4 shadow-md shadow-purple-400/10 border border-gray-400/20 z-10">
      <div className={`w-12 h-12 flex items-center justify-center text-[26px]  text-white rounded-full ${color} drop-shadow-xl`}>
        {icons}
      </div>
      <div className="flex flex-col gap-1">
        <h6 className="text-xs mb-1 text-gray-500">{label}</h6>
        <p className="text-[20px]">{value}</p>
      </div>
    </div>
  );
};


