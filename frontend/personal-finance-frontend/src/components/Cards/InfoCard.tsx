import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  change?: string;
  changeType?: "positive" | "negative";
  trend?: "up" | "down";
  subtitle?: string;
}

const InfoCard = ({ 
  icon, 
  label, 
  value, 
  color, 
  change, 
  changeType, 
  trend,
  subtitle 
}: InfoCardProps) => {
  return (
    <div className="info-card group">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full -mr-12 -mt-12 transition-all duration-300 group-hover:opacity-10`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`info-card-icon ${color} shadow-lg`}>
            {icon}
          </div>
          
          {/* Change indicator */}
          {change && (
            <div className={`info-card-change ${
              changeType === "positive" 
                ? "text-green-600 bg-green-50" 
                : "text-red-600 bg-red-50"
            } px-2 py-1 rounded-full`}>
              {changeType === "positive" ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              {change}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="space-y-2">
          <p className="info-card-label">{label}</p>
          <p className="info-card-value">{value}</p>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <div className={`w-2 h-2 rounded-full ${
              trend === "up" ? "bg-green-500" : "bg-red-500"
            }`}></div>
            <span className={`text-xs font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}>
              {trend === "up" ? "Trending up" : "Trending down"}
            </span>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
    </div>
  );
};

export default InfoCard;