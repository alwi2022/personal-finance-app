import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/userAuth";
import type { TypeTransaction } from "../../types/type";
import { API_PATH } from "../../utils/api";
import axiosInstance from "../../utils/axios-instance";
import toast from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/ExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { useSettings } from "../../context/settingsContext";

export default function Expense() {
    useUserAuth();
    const { t } = useSettings();
    
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [expenseData, setExpenseData] = useState<TypeTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState<{
        show: boolean;
        data: string | null;
    }>({ show: false, data: null });

    const fetchExpenseDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE);
            if (response.status === 200) {
                setExpenseData(response.data);
            } else {
                toast.error(t('failed_load_expense') || "Failed to load expense data");
            }
        } catch (error) {
            console.error("Error fetching expense details:", error);
            toast.error(t('error_fetching_expense') || "Error fetching expense details");
        } finally {
            setLoading(false);
        }
    };

    // Function untuk handle success callback dari form
    const handleExpenseAdded = () => {
        fetchExpenseDetails();
        setOpenAddExpenseModal(false);
    };

    const deleteExpense = async (id: string | null) => {
        if (!id) return;
        try {
            const url = API_PATH.EXPENSE.DELETE_EXPENSE.replace(":id", id);
            const response = await axiosInstance.delete(url);
            if (response.status === 200) {
                toast.success(t('expense_deleted_success') || "Expense deleted successfully");
                fetchExpenseDetails();
            } else {
                toast.error(t('failed_delete_expense') || "Failed to delete expense");
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
            toast.error(t('error_deleting_expense') || "Error deleting expense");
        } finally {
            setOpenDeleteAlert({ show: false, data: null });
        }
    };

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXCEL, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success(t('expense_downloaded_success') || "Expense details downloaded successfully");
        } catch (error) {
            console.error("Error downloading expense details:", error);
            toast.error(t('error_downloading_expense') || "Error downloading expense details");
        }
    };

    useEffect(() => {
        fetchExpenseDetails();
        return () => {}
    }, []);

    return (
        <DashboardLayout activeMenu="Expenses">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <ExpenseOverview
                            transactions={expenseData}
                            onExpanseIncome={() => setOpenAddExpenseModal(true)}
                        />
                    </div>
                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id: string) =>
                            setOpenDeleteAlert({ show: true, data: id })
                        }
                        onDownload={handleDownloadExpenseDetails}
                    />
                </div>
                
                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOpenAddExpenseModal(false)}
                    title={t('add_new_expense') || "Add Expense"}
                >
                    <AddExpenseForm
                        onAddExpense={handleExpenseAdded} // ✅ Now matches the interface
                        onCancel={() => setOpenAddExpenseModal(false)}
                        isLoading={loading}
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title={t('delete_expense') || "Delete Expense"}
                >
                    <DeleteAlert
                        content={t('confirm_delete_expense') || "Are you sure you want to delete this expense?"}
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                        onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    )
}