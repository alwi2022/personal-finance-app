import moment from "moment";
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
  });
};

export const prepareBarExpenseChartData = (
  transactions: TypeTransaction[] = []
) => {
  const groupedByMonth: { [month: string]: number } = {};
  const last30Days = moment().subtract(30, "days");

  transactions = transactions.filter((transaction) =>
    moment(transaction.date).isAfter(last30Days)
  );

  transactions.forEach((transaction) => {
    const month = moment(transaction.date).format("MMM"); // "May", "Apr"
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
  const chartData = sortedData.map((item)=>(
    {
      month: moment(item.date).format("DD MMM"),
      amount: item.amount,
      source: item.source
    }
  ))

  return chartData;

  
} 

