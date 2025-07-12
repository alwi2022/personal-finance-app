import dayjs from 'dayjs';
import 'dayjs/locale/id';
import type { TypeTransaction } from "../types/type";



export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const getInitials = (fullName: string) => {
  if (!fullName) return "";
  const names = fullName.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(names.length, 2); i++) {
    initials += names[i][0];
  }
  return initials.toUpperCase();
}

export const addThousandSeparator = (value: number) => {
  return value.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const prepareBarExpenseChartData = (
  transactions: TypeTransaction[] = []
) => {
  const groupedByMonth: { [month: string]: number } = {};
  const last30Days = dayjs().subtract(30, "days");

  transactions = transactions.filter((transaction) =>
    dayjs(transaction.date).isAfter(last30Days)
  );

  transactions.forEach((transaction) => {
    const month = dayjs(transaction.date).format("MMM"); // "May", "Apr"
    if (!groupedByMonth[month]) {
      groupedByMonth[month] = 0;
    }
    groupedByMonth[month] += transaction.amount;
  });

  const chartData = Object.entries(groupedByMonth).map(([month, amount]) => ({
    month,
    amount,
  }));

  return chartData;
};


export const prepareIncomeBarChartData = (transactions: TypeTransaction[]) => {
  const sortedData = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData = sortedData.map((item) => (
    {
      month: dayjs(item.date).format("DD MMM"),
      amount: item.amount,
      source: item.source
    }
  ))

  return chartData;


}


export const prepareExpanseLineChartData = (transactions: TypeTransaction[]) => {
  const sortedData = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData = sortedData.map((item) => (
    {
      month: dayjs(item.date).format("DD MMM"),
      amount: item.amount,
      category: item.category
    }
  ))

  return chartData;
}


export const formatNumberInput = (value: string) => {
  // Hilangkan semua non-digit
  const numeric = value.replace(/[^\d]/g, "");

  if (!numeric) return "";

  // Format jadi 1.000.000
  return parseInt(numeric).toLocaleString("id-ID");
};

// Dapatkan nilai mentah number dari input yang sudah diformat
export const parseFormattedNumber = (formatted: string) => {
  return parseInt(formatted.replace(/\./g, "")) || 0;
};
