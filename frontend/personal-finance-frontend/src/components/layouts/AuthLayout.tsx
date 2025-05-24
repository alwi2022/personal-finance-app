import { LuTrendingUpDown } from "react-icons/lu";
import type { AuthLayoutProps } from "../../types/type";

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left: Form Area */}
      <div className="w-full md:w-3/5 px-6 py-6 bg-white flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-black">Expense Tracker</h2>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:flex w-2/5 bg-violet-50 relative items-center justify-center overflow-hidden">
        {/* Decorative Background Shapes */}
        <div className="absolute w-48 h-48 bg-purple-600 rounded-[40px] -top-7 -left-5" />
        <div className="absolute w-48 h-56 border-[20px] border-fuchsia-600 rounded-[40px] top-[30%] -right-10" />
        <div className="absolute w-48 h-48 bg-violet-500 rounded-[40px] -bottom-7 -right-5" />

        {/* Info Card */}
        <div className="z-10 w-[80%] max-w-sm">
          <StatsInfoCard
            icons={<LuTrendingUpDown />}
            label="Track your income and expenses"
            value="Rp430,000"
            color="bg-primary"
          />
        </div>

        {/* Chart Image */}
        <img
          src="/assets/image/chartThum.png"
          alt="Finance app illustration"
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[80%] max-w-xs shadow-lg"
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
    <div className="flex gap-4 bg-white rounded-xl p-4 shadow-md border border-gray-200">
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white rounded-full ${color}`}>
        {icons}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
