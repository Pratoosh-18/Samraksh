import React, { useEffect, useState } from 'react';
import VideoUpload from '../video-upload';

const BlockadeInfo = ({ data }) => {
  const [alert, setAlert] = useState('');
  
  const dataArray = Object.values(data);

  useEffect(() => {
    const totalPeople = dataArray.length;
    const halfPeople = Math.floor(totalPeople / 3);
    
    const blockedCount = dataArray.filter(item => {
      const firstDetectedTime = new Date(item.first_detacted);
      const lastDetectedTime = new Date(item.last_detacted);
      const duration = (lastDetectedTime - firstDetectedTime) / 1000; 

      return duration > 10;
    }).length;

    if (blockedCount >= halfPeople && halfPeople > 0) {
      setAlert('The area is blocked for too long.');
    } else {
      setAlert('');
    }
  }, [dataArray]);

  return (
    <div className='border-2 w-[100%] min-h-[700px] lg:w-[40%] p-4 lg:m-4 flex flex-col items-center bg-gray-50'>
      <VideoUpload />

      {alert && (
        <div className='alert bg-red-100 text-red-800 border border-red-400 text-2xl font-semibold rounded p-6 my-2 mt-14'>
          {alert}
        </div>
      )}

      {!alert && (
        <div className='alert bg-green-100 text-black border border-green-400 text-2xl font-semibold rounded p-6 my-2 mt-14'>
          Status : Normal
        </div>
      )}

      <div className='mt-4'>
        <h2 className='font-bold text-2xl mb-6'>Crowd Blocked Detection</h2>
        <p className='text-2xl'>Total Detected People: {dataArray.length}</p>
        <p className='text-2xl'>People Blocked for More Than 10 Seconds: {dataArray.filter(item => {
          const firstDetectedTime = new Date(item.first_detacted);
          const lastDetectedTime = new Date(item.last_detacted);
          const duration = (new Date(lastDetectedTime) - new Date(firstDetectedTime)) / 1000;
          return duration > 10;
        }).length}</p>
      </div>
    </div>
  );
};

export default BlockadeInfo;
