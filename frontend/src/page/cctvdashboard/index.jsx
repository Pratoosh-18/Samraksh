import React, { useState } from 'react';
import CCTVVideoPlayer from '@/components/cctvvideoplayer';
import useVideoStreams from '@/hooks/useVideoStreams';
import SideBar from '@/components/sidebar';

const CCTVDashboardPage = () => {
  const videoStreams = useVideoStreams();
  const [cameraDetails, setCameraDetails] = useState({});

  const handleVideoDetailsChange = (index, details) => {
    setCameraDetails((prevDetails) => ({
      ...prevDetails,
      [index]: details,
    }));
  };

  return (
    <div className="flex">
      <SideBar className="w-[20%]" videoStreams={videoStreams} cameraDetails={cameraDetails} />

      <div className="w-[100%] md:w-[80%] flex gap-2 p-6 flex-wrap">
        {videoStreams.map((videoStream, index) => (
          <CCTVVideoPlayer
            key={index}
            stream={videoStream.stream}
            label={videoStream.label}
            muted={true}
            onVideoDetailsChange={(details) => handleVideoDetailsChange(index, details)}
          />
        ))}
      </div>
    </div>
  );
};

export default CCTVDashboardPage;
