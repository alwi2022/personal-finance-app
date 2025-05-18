import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import type { TypeTransaction } from "../../types/type";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-toastify";
import Modal from "../../components/layouts/Modal";

export default function Income() {
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState<TypeTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<{
    show: boolean;
    data: TypeTransaction | null;
  }>({
    show: false,
    data: null,
  });

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

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="container mx-auto my-6 px-4">
        <div className="grid grid-cols-1 gap-6">
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <div className="text-sm text-gray-600">
            {/* TODO: Add income form here */}
            This is where the income form will appear.
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
