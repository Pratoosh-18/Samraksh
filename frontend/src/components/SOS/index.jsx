import { useAppContext } from "@/context/app-provider";
import { useState } from "react";
import { FaExclamationCircle, FaTimes, FaClipboard } from "react-icons/fa";
import axios from "axios";
import api from "@/utils/api";

function SOSButton() {
  const { isAuthenticated } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [phoneno, setPhoneNo] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(''); // Track copy success message

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const getIPAddress = async () => {
    try {
      const res = await axios.get('https://api.ipify.org?format=json');
      return res.data.ip;
    } catch (err) {
      console.error('Failed to get IP address', err);
      return null;
    }
  };

  const handleSubmitSOS = async () => {
    if (!phoneno) {
      setError('Please provide your phone number.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const ip_address = await getIPAddress();
      const sosData = {
        ip_address,
        description: description.trim() ? description : "empty",
        phoneno: parseInt(phoneno, 10),
        is_resolved: false,
      };

      await api.post('/add-sos', sosData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('SOS request submitted successfully!');
      setShowModal(false);
      setDescription('');
      setPhoneNo('');
    } catch (err) {
      console.error('Failed to submit SOS request', err);
      setError('Failed to submit SOS request.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number)
      .then(() => {
        setCopySuccess(`Copied ${number} to clipboard!`);
        setTimeout(() => setCopySuccess(''), 2000); // Clear the message after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
  };

  if (isAuthenticated) return null;

  return (
    <>
      <button
        onClick={toggleModal}
        className="fixed bottom-10 right-10 w-[300px] h-[100px] bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 flex justify-center items-center text-3xl animate-bounce-slow"
      >
        <FaExclamationCircle className="mr-2" />
        SOS
      </button>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl text-red-500 font-bold mb-4">Submit SOS Request</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input
                type="text"
                value={phoneno}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Describe the emergency..."
                rows="4"
              ></textarea>
            </div>

            <button
              onClick={handleSubmitSOS}
              className={`w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-200 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit SOS'}
            </button>

            <div className="border-2 border-gray-300 rounded-md mt-4 p-4">
              <h4 className="text-lg mb-2">Helpline desk:</h4>
              <div className="flex text-sm justify-between items-center mb-2">
                <p>Ambulance: +91 6738726374</p>
                <FaClipboard className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={() => copyToClipboard('+91 6738726374')} />
              </div>
              <div className="flex text-sm justify-between items-center mb-2">
                <p>First aid: +91 6733198465</p>
                <FaClipboard className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={() => copyToClipboard('+91 6733198465')} />
              </div>
              <div className="flex text-sm justify-between items-center mb-2">
                <p>Fire department: +91 9988236475</p>
                <FaClipboard className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={() => copyToClipboard('+91 9988236475')} />
              </div>
              <div className="flex text-sm justify-between items-center mb-2">
                <p>Police headquarters: +91 9122430587</p>
                <FaClipboard className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={() => copyToClipboard('+91 9122430587')} />
              </div>
              {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SOSButton;