import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import type { TypeTransaction } from "../../types/type";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";

import Modal from "../../components/layouts/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { useUserAuth } from "../../hooks/userAuth";

type IncomeFormInput = {
  amount: number;
  date: string;
  source: string;
  category: string;
};

export default function Income() {
  useUserAuth();
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState<TypeTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<{
    show: boolean;
    data: string | null;
  }>({ show: false, data: null });

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);
      if (response.status === 200) {
        setIncomeData(response.data);
      } else {
        toast.error("Failed to load income data");
      }
    } catch (error) {
      console.error("Error fetching income details:", error);
      toast.error("Error fetching income details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income: IncomeFormInput) => {
    const { source, amount, date, category } = income;
    if (!source.trim()) return toast.error("Source is required");
    if (!amount) return toast.error("Amount is required");
    if (!date) return toast.error("Date is required");
    if (!category) return toast.error("Category is required");

    try {
      const response = await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon: category,
      });
      if (response.status === 201) {
        toast.success("Income added successfully");
        fetchIncomeDetails();
        setOpenAddIncomeModal(false);
      } else {
        toast.error("Failed to add income");
        console.log(response.data.message?.errors, "response");
      }
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Error adding income");
    }
  };

  const deleteIncome = async (id: string | null) => {
    if (!id) return;
    try {
      const url = API_PATH.INCOME.DELETE_INCOME.replace(":id", id);
      const response = await axiosInstance.delete(url);
      if (response.status === 200) {
        toast.success("Income deleted successfully");
        fetchIncomeDetails();
      } else {
        toast.error("Failed to delete income");
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Error deleting income");
    } finally {
      setOpenDeleteAlert({ show: false, data: null });
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_EXCEL, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Income details downloaded successfully");

    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Error downloading income details");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="container mx-auto my-10 px-4 space-y-6">
        <IncomeOverview
          transactions={incomeData}
          onAddIncome={() => setOpenAddIncomeModal(true)}
        />

        <IncomeList
          transactions={incomeData}
          onDelete={(id: string) =>
            setOpenDeleteAlert({ show: true, data: id })
          }
          onDownload={handleDownloadIncomeDetails}
        />

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => !loading && setOpenAddIncomeModal(false)}
          title="Add New Income"
        >
          <AddIncomeForm
            onAddIncome={handleAddIncome}
            isLoading={loading}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
