import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import type { TypeTransaction } from "../../types/type";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { useSettings } from "../../context/settingsContext";

import Modal from "../../components/layouts/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { useUserAuth } from "../../hooks/userAuth";

export default function Income() {
  useUserAuth();
  const { t } = useSettings();
  
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
        toast.error(t('failed_to_load_income_data') || "Failed to load income data");
      }
    } catch (error) {
      console.error("Error fetching income details:", error);
      toast.error(t('error_fetching_income_details') || "Error fetching income details");
    } finally {
      setLoading(false);
    }
  };

  // Updated handler to match new AddIncomeForm interface
  const handleAddIncome = (success: boolean) => {
    if (success) {
      // Refresh data when income is successfully added
      fetchIncomeDetails();
      setOpenAddIncomeModal(false);
    }
  };

  const deleteIncome = async (id: string | null) => {
    if (!id) return;
    try {
      const url = API_PATH.INCOME.DELETE_INCOME.replace(":id", id);
      const response = await axiosInstance.delete(url);
      if (response.status === 200) {
        toast.success(t('income_deleted_successfully') || "Income deleted successfully");
        fetchIncomeDetails();
      } else {
        toast.error(t('failed_to_delete_income') || "Failed to delete income");
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error(t('error_deleting_income') || "Error deleting income");
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
      toast.success(t('income_details_downloaded') || "Income details downloaded successfully");

    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error(t('error_downloading_income') || "Error downloading income details");
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
          title={t('add_new_income') || "Add New Income"}
        >
          <AddIncomeForm
            onAddIncome={handleAddIncome}
            onCancel={() => setOpenAddIncomeModal(false)}
            isLoading={loading}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title={t('delete_income') || "Delete Income"}
        >
          <DeleteAlert
            content={t('confirm_delete_income') || "Are you sure you want to delete this income?"}
            onDelete={() => deleteIncome(openDeleteAlert.data)}
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}