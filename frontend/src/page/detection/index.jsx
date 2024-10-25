import { useAppContext } from "@/context/app-provider";
import VideoStream from "@/components/video-stream";
import { useState } from "react";
import CamStream from "@/components/cam-stream";
import DetectionVideoInfo from "@/components/crowd-info";
import WeaponInfo from "@/components/weapon-info";
import FaceDetectionInfo from "@/components/face-info";
import BlockadeInfo from "@/components/blockade-info";

function DetectionPage() {
  const { appData } = useAppContext();
  const [activeModel, setActiveModel] = useState("crowd_detection");
  const [faceDetectionId, setFaceDetectionId] = useState("all");
  const [activeUploadFileIdx, setActiveUploadFileIdx] = useState(-1);
  const [useWebcam, setUseWebcam] = useState("false");

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <div className="flex w-[100%] lg:w-[60%] flex-col m-4 justify-between items-center">
        <div className="mb-2 flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span>Detect: </span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-[150px] p-2.5 dark:bg-accent-500 dark:border-accent-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent-500 dark:focus:border-accent-600"
            >
              <option value="crowd_detection">Crowd</option>
              <option value="face_detection">Face</option>
              <option value="weapon_detection">Weapon</option>
              <option value="blockade_detection">Blockade</option>
            </select>
          </div>

          {useWebcam === "false" && (
            <div className="flex items-center gap-2">
              <span>Video Source: </span>
              <select
                value={activeUploadFileIdx}
                onChange={(e) => setActiveUploadFileIdx(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-[150px] p-2.5 dark:bg-accent-500 dark:border-accent-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent-500 dark:focus:border-accent-600"
              >
                <option value={-1}>Default</option>
                {appData.uploaded_videos_list.map((filename, idx) => (
                  <option key={filename} value={idx}>
                    {filename}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span>Use Webcam: </span>
            <select
              value={useWebcam}
              onChange={(e) => setUseWebcam(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-[150px] p-2.5 dark:bg-accent-500 dark:border-accent-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent-500 dark:focus:border-accent-600"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {activeModel === "face_detection" && (
            <div className="flex items-center gap-2">
              <span>Detect Face: </span>
              <select
                value={faceDetectionId}
                onChange={(e) => setFaceDetectionId(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-[150px] p-2.5 dark:bg-accent-500 dark:border-accent-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent-500 dark:focus:border-accent-600"
              >
                <option value="all">All</option>
                {Object.entries(appData.face_ids_map).map(
                  ([faceId, personName]) => (
                    <option key={faceId} value={faceId}>
                      {personName}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
        </div>

        <div className="w-full h-full flex justify-center">
          {useWebcam === "false" && (
            <VideoStream
              activeModel={activeModel}
              uploadFileIdx={activeUploadFileIdx}
              faceDetectionId={faceDetectionId}
            />
          )}
          {useWebcam === "true" && <CamStream
            activeModel={activeModel}
            faceDetectionId={faceDetectionId}
          />}
        </div>
      </div>

      {
        activeModel === "crowd_detection" ? (
          <DetectionVideoInfo className="w-[40%]" count={appData.active_persons} />
        ) : activeModel === "face_detection" ? (
          <FaceDetectionInfo className="w-[40%]" />
        ) : activeModel === "weapon_detection" ? (
          <WeaponInfo className="w-[40%]" />
        ) : activeModel === "blockade_detection" ? (
          <BlockadeInfo className="w-[40%]" data={appData.detected_persons_ids_map} />
        ) : null
      }

    </div>
  );
}

export default DetectionPage;
