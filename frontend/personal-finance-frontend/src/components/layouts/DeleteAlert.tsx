import { AlertTriangle, Trash2, X } from "lucide-react";
import { useSettings } from "../../context/settingsContext";

interface DeleteAlertProps {
  content: string;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
  itemName?: string;
}

const DeleteAlert = ({ 
  content, 
  onDelete, 
  onCancel, 
  isLoading = false,
  title = "confirm_deletion",
  itemName
}: DeleteAlertProps) => {
  const { t } = useSettings();
  return (
    <div className="text-center space-y-6">
      {/* Warning Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {t(title)}
        </h3>
        <p className="text-gray-600">
          {t(content)}
        </p>
        {itemName && (
          <p className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
            <span className="font-medium">{t('item')}:</span> {itemName}
          </p>
        )}
      </div>

      {/* Warning Message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 text-red-800">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">
            {t('this_action_cannot_be_undone')}
          </span>
        </div>
        <p className="text-xs text-red-600 mt-1">
          {t('please_make_sure_you_want_to_permanently_delete_this_item')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="btn-secondary btn-sm px-6"
        >
          <X size={16} />
          {t('cancel')}
        </button>
        
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="btn-primary btn-sm px-6 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 focus:ring-red-200"
        >
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <Trash2 size={16} />
              {t('delete')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;