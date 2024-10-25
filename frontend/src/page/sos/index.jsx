import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'; // Icons for resolved/unresolved
import { MdPhone, MdOutlineDescription, MdLocationOn } from 'react-icons/md'; // Icons for details

const SOSPage = () => {
    const [sosData, setSosData] = useState([]);
    const [isLoadingSoss, setIsLoadingSoss] = useState(false)

    const getAllSOS = async () => {
        setIsLoadingSoss(true)
        try {
            const res = await api.get("/retrieve-soss");
            const sosWithLocation = await Promise.all(res.data.map(async (sos) => {
                const location = await getLocationByIP(sos.ip_address);
                return { ...sos, location };
            }));
            setSosData(sosWithLocation);  // Storing the SOS data in state
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingSoss(false)
        }
    };

    const getLocationByIP = async (ip) => {
        try {
            const response = await fetch(`https://api.ipapi.com/api/${ip}?access_key=YOUR_API_KEY`);
            const data = await response.json();
            return data.city ? `${data.city}, ${data.region}, ${data.country}` : 'Location not found';
        } catch (error) {
            console.error('Error fetching location:', error);
            return 'Location not available';
        }
    };

    const resolveSOS = async (sos) => {
        try {
            await api.post(`/update-sos/${sos.id}`, {
                ip_address: sos.ip_address,
                description: sos.description,
                phoneno: sos.phoneno,
                is_resolved: true // Only change the resolved status
            });

            // Update the local state to reflect that the SOS is resolved
            setSosData(prevData =>
                prevData.map(item =>
                    item.id === sos.id ? { ...item, is_resolved: true, resolved_at: new Date().toLocaleString() } : item
                )
            );
        } catch (error) {
            console.error('Error resolving SOS:', error);
        }
    };

    useEffect(() => {
        getAllSOS();
    }, []);

    return (
        <div className='min-h-[90vh] px-20 py-10'>
            <h2 className='text-3xl font-bold mb-8'>Active SOS :</h2>

            {isLoadingSoss && <dic className='h-[70vh] w-full flex justify-center items-center'>
                <div class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                    <span className="sr-only text-2xl">Loading...</span>
                </div>
            </dic>}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {sosData.map((sos, index) => (
                    <div
                        key={sos.id}
                        className={`p-6 rounded-lg shadow-lg flex flex-col space-y-4 
              ${sos.is_resolved ? 'bg-green-100' : 'bg-red-100'} 
              border ${sos.is_resolved ? 'border-green-400' : 'border-red-400'}`}
                    >
                        <div className='flex justify-between items-center'>
                            <h3 className='text-xl font-semibold'>
                                SOS #{index + 1}
                            </h3>
                            {sos.is_resolved ? (
                                <FaCheckCircle className='text-green-600 text-2xl' />
                            ) : (
                                <FaExclamationTriangle className='text-red-600 text-2xl' />
                            )}
                        </div>

                        <div className='flex items-center space-x-2'>
                            <MdPhone className='text-gray-700' />
                            <p className='text-lg'>{sos.phoneno}</p>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <MdOutlineDescription className='text-gray-700' />
                            <p className='text-lg'>{sos.description}</p>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <MdLocationOn className='text-gray-700' />
                            {/* <p className='text-lg'>{sos.location || sos.ip_address}</p> */}
                            <p className='text-lg'>{sos.ip_address}</p>
                        </div>

                        {sos.is_resolved ? (
                            <p className='font-bold text-lg text-green-600'>
                                Resolved on: {sos.resolved_at}
                            </p>
                        ) : (
                            <button
                                onClick={() => resolveSOS(sos)}
                                className='px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700'
                            >
                                Mark as Resolved
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SOSPage;
