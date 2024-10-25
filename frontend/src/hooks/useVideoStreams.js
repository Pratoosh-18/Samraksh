import { useEffect, useState } from 'react';

const useVideoStreams = () => {
  const [videoStreams, setVideoStreams] = useState([]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices)
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        const streams = await Promise.all(videoDevices.map(async (device) => {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: device.deviceId },
            audio: false
          });
          return { stream, label: device.label || `Camera ${device.deviceId}` };
        }));

        setVideoStreams(streams);
      } catch (err) {
        console.error('Error accessing local cameras:', err);
      }
    };

    getCameras();

    return () => {
      videoStreams.forEach(({ stream }) => {
        stream.getTracks().forEach(track => track.stop());
      });
    };
  }, []);

  return videoStreams;
};

export default useVideoStreams;