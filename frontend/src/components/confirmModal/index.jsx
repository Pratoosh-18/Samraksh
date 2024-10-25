const ConfirmModal = ({ message, onConfirm, onClose, confirmColor }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm</h2>
        
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className={`${confirmColor} text-white px-4 py-2 rounded`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
