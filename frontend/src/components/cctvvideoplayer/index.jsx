import React, { useEffect, useRef, useState } from 'react';

const CCTVVideoPlayer = ({ stream, url, muted = true, onVideoDetailsChange }) => {
  const videoRef = useRef(null);
  const [videoDetails, setVideoDetails] = useState({
    currentTime: 0,
    duration: 0,
    resolution: { width: 0, height: 0 },
    playbackRate: 1,
    volume: 1,
    buffered: 0,
    isPaused: true,
    isMuted: muted,
  });

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    } else if (url && videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.load();
    }
  }, [stream, url]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const newVideoDetails = {
        duration: video.duration,
        resolution: { width: video.videoWidth, height: video.videoHeight },
        volume: video.volume,
        isMuted: video.muted,
      };
      setVideoDetails((prevDetails) => ({
        ...prevDetails,
        ...newVideoDetails,
      }));
      onVideoDetailsChange(newVideoDetails);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const buffered = video.buffered.length > 0 ? video.buffered.end(0) : 0;
      const updatedDetails = {
        currentTime: video.currentTime,
        buffered,
        isPaused: video.paused,
      };
      setVideoDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedDetails,
      }));
      onVideoDetailsChange(updatedDetails);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative bg-black overflow-hidden shadow-lg h-fit rounded-md">
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        controls={!stream}
        className="w-full h-[350px] object-cover"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onRateChange={() =>
          setVideoDetails((prev) => ({
            ...prev,
            playbackRate: videoRef.current.playbackRate,
          }))
        }
        onVolumeChange={() =>
          setVideoDetails((prev) => ({
            ...prev,
            volume: videoRef.current.volume,
            isMuted: videoRef.current.muted,
          }))
        }
      />
      <div className="absolute bottom-0 right-0 text-white bg-black bg-opacity-75 p-3 text-xs rounded-md">
        <p>Current Time: {formatTime(videoDetails.currentTime)}</p>
        <p>
          Resolution: {videoDetails.resolution.width}x
          {videoDetails.resolution.height}
        </p>
        <p>Buffered: {formatTime(videoDetails.buffered)}</p>
        <p>Playback Rate: {videoDetails.playbackRate}x</p>
        <p>Duration: {formatTime(videoDetails.duration)}</p>
        <p>Volume: {(videoDetails.volume * 100).toFixed(0)}%</p>
        <p>Status: {videoDetails.isPaused ? 'Paused' : 'Playing'}</p>
        <p>Muted: {videoDetails.isMuted ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default CCTVVideoPlayer;
