interface DeleteAlertProps {
    content: string;
    onDelete: () => void;
    onCancel: () => void;
  }
  
  const DeleteAlert = ({ content, onDelete, onCancel }: DeleteAlertProps) => {
    return (
      <div className="flex flex-col gap-4 text-sm text-white">
        <p>{content}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };
  
  export default DeleteAlert;
  