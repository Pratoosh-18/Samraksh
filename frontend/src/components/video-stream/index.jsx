import { useEffect, useRef } from "react";

const VideoStream = ({ activeModel, uploadFileIdx, faceDetectionId }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const streamUrl = `http://localhost:8000/stream-video?active_model=${activeModel}&upload_file_idx=${uploadFileIdx}&face_detection_id=${faceDetectionId}`;
    img.src = streamUrl;

    return () => {
      img.src = "";
    };
  }, [activeModel, uploadFileIdx,faceDetectionId]);

  return (
    <div>
      <img ref={imgRef} alt="Video Stream" className="max-h-[76vh]" />
    </div>
  );
};

export default VideoStream;
