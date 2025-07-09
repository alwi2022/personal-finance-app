import { TrendingUp, Shield, BarChart3, PieChart, DollarSign, Users } from "lucide-react";
import CARD_2 from "../../assets/chartThum.png";
import type { AuthLayoutProps } from "../../types/type";

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center px-8 py-12 bg-white">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FinanceTracker</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Take control of your financial future
          </p>
        </div>

        {/* Form Content */}
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            Trusted by over 10,000+ users worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-primary/10 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-16 w-24 h-24 bg-purple-400/20 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-16 w-40 h-40 bg-blue-400/20 rounded-full blur-xl"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary/10 rounded-2xl rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-purple-400/10 rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-12 h-12 bg-blue-400/10 rounded-lg rotate-45"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          {/* Main Illustration */}
          <div className="mb-8 relative">
            <div className="w-80 h-80 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center">
              <img
                src={CARD_2}
                alt="Finance Dashboard"
                className="w-72 h-72 object-contain"
              />
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -top-4 -left-4">
              <StatsCard
                icon={<DollarSign size={16} />}
                label="Total Balance"
                value="$124,230"
                color="bg-green-500"
                trend="+12.5%"
              />
            </div>
            
            <div className="absolute -bottom-4 -right-4">
              <StatsCard
                icon={<BarChart3 size={16} />}
                label="Monthly Growth"
                value="$8,450"
                color="bg-blue-500"
                trend="+8.2%"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Financial Management
            </h2>
            <p className="text-gray-600 text-lg max-w-md">
              Track expenses, monitor income, and make informed financial decisions with our intuitive dashboard.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mt-8">
              <FeatureItem
                icon={<Shield size={20} />}
                title="Secure & Private"
                description="Bank-level security for your financial data"
              />
              <FeatureItem
                icon={<PieChart size={20} />}
                title="Smart Analytics"
                description="AI-powered insights and spending patterns"
              />
              <FeatureItem
                icon={<Users size={20} />}
                title="Multi-Account"
                description="Manage multiple accounts in one place"
              />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>GDPR Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  trend: string;
}

const StatsCard = ({ icon, label, value, color, trend }: StatsCardProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 min-w-[140px]">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="text-xs text-green-600 font-medium">{trend}</div>
    </div>
  );
};

// Feature Item Component
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="flex items-start gap-3 text-left">
      <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-gray-600 text-xs">{description}</p>
      </div>
    </div>
  );
};

export default AuthLayout;