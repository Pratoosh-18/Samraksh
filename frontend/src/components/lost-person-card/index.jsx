import api from '@/utils/api';
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ConfirmModal from '../confirmModal';

const LostPersonCard = ({ person, fetchReports }) => {
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [confirmButtonColor, setConfirmButtonColor] = useState("bg-red-500")

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'detected':
        return 'bg-blue-500';
      case 'lost':
        return 'bg-red-500';
      case 'found':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleButtonClick = async (newStatus) => {
    setLoadingStatus(newStatus);
    setShowModal(false);
    if(newStatus==="detected"){
      setConfirmButtonColor("bg-blue-500")
    }
    if(newStatus==="lost"){
      setConfirmButtonColor("bg-red-500")
    }
    if(newStatus==="found"){
      setConfirmButtonColor("bg-green-500")
    }

    try {
      const res = await api.post(
        `update-report-lost-child/${person.id}`,
        {
          fullname: person.fullname,
          age: person.age,
          gender: person.gender,
          describe_appearance: person.describe_appearance,
          last_seen_location: person.last_seen_location,
          follow_up_name: person.follow_up_name,
          follow_up_phone: "9845632234",  // Temporary hardcoded phone
          detected_near: person.detected_near,
          is_detected: false,
          status: newStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status !== 200) {
        throw new Error('Failed to update status');
      }

      console.log('Update successful:', res.data);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoadingStatus(null);
      fetchReports(); 
    }
  };

  const handleActionClick = (newStatus) => {
    setSelectedStatus(newStatus); 
    setShowModal(true);           
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm transition-all w-[300px]">
      <div className="flex-1 text-center lg:text-left">
        <img className="h-[300px] w-[300px] object-cover" src={person.child_img} alt="Person" />
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{person.fullname}</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Age:</span> {person.age}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Gender:</span> {person.gender}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Appearance:</span> {person.describe_appearance}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Last Seen:</span> {person.last_seen_location}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span> {person.follow_up_phone}
        </p>
        <div className={`text-white px-4 py-2 rounded-md mt-3 ${getStatusBgColor(person.status)}`}>
          Status: {person.status.charAt(0).toUpperCase() + person.status.slice(1)}
        </div>

        <h6 className="mx-3 my-3">Actions:</h6>
        <div className="flex flex-col gap-3">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 flex justify-center items-center"
            onClick={() => handleActionClick('detected')}
            disabled={person.status !== 'lost' || loadingStatus !== null}
          >
            {loadingStatus === 'detected' ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            Mark as Detected
          </button>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300 flex justify-center items-center"
            onClick={() => handleActionClick('found')}
            disabled={!(person.status === 'lost' || person.status === 'detected') || loadingStatus !== null}
          >
            {loadingStatus === 'found' ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            Mark as Found
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300 flex justify-center items-center"
            onClick={() => handleActionClick('lost')}
            disabled={!(person.status === 'detected' || person.status === 'found') || loadingStatus !== null}
          >
            {loadingStatus === 'lost' ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            Mark as Not Detected
          </button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          message={`Are you sure you want to mark this person as ${selectedStatus}?`}
          onConfirm={() => handleButtonClick(selectedStatus)}  
          onClose={() => setShowModal(false)}                 
          confirmColor={confirmButtonColor}
        />
      )}
    </div>
  );
};

export default LostPersonCard;
