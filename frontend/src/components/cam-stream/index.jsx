import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam"; 

const CamStream = ({ activeModel, faceDetectionId }) => {
  const [processedFrame, setProcessedFrame] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const webcamRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const getCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    };
    getCameras();
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `ws://localhost:8000/stream-cam?active_model=${activeModel}&face_detection_id=${faceDetectionId}`,
    );

    socketRef.current.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setProcessedFrame(imageUrl);
    };

    return () => socketRef.current.close();
  }, [activeModel, faceDetectionId]);

  const sendFrame = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => blob.arrayBuffer())
      .then((buffer) => socketRef.current.send(buffer));
  };

  useEffect(() => {
    const interval = setInterval(
      sendFrame,
      activeModel === "face_detection" ? 800 : 150,
    );
    return () => clearInterval(interval);
  }, [activeModel]);

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div className="relative">
      <div className="flex justify-center items-center gap-2 mb-3">
        <label htmlFor="camera-select">Select Camera: </label>
        <select
          id="camera-select"
          value={selectedDeviceId}
          onChange={handleDeviceChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-[350px] p-2.5 dark:bg-accent-500 dark:border-accent-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent-500 dark:focus:border-accent-600"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>

      <div style={{ visibility: "hidden", position: "absolute" }}>
        {selectedDeviceId && (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ deviceId: selectedDeviceId }}
            // width={640}
            height={680}
          />
        )}
      </div>

      <div className="">
        {processedFrame && <img className="h-[550px]" src={processedFrame} alt="Processed Frame" />}
      </div>
    </div>
  );
};

export default CamStream;
