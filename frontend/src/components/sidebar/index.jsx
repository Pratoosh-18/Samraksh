import React from 'react';
import { FaVideo, FaPause, FaPlay, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa';
import { MdTimer, MdHd } from 'react-icons/md';

const SideBar = ({ videoStreams, cameraDetails }) => {

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-[400px] hidden md:block p-4 h-screen">
            <h2 className="text-xl font-semibold mb-4 text-accent-500">Connected Cameras</h2>
            <ul>
                {videoStreams.map((stream, index) => {
                    const details = cameraDetails[index] || {};
                    return (
                        <li key={index} className="mb-4 p-3 bg-brand-100 rounded-lg shadow-lg">
                            <h6 className="text-brand-700 flex items-center gap-2">
                                <FaVideo className="text-brand-700" /> {stream.label}
                            </h6>
                            <p className="text-brand-900 flex items-center gap-2">
                                Status: {stream.stream ? <FaPlay className="text-green-600" /> : <FaPause className="text-red-600" />}
                                {stream.stream ? 'Connected' : 'Disconnected'}
                            </p>
                            {details && (
                                <div className="text-sm mt-2 text-brand-700">
                                    <p className="flex items-center gap-2">
                                        <MdTimer /> Current Time: {formatTime(details.currentTime)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MdHd /> Resolution: {details.resolution?.width}x{details.resolution?.height}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MdTimer /> Buffered: {formatTime(details.buffered)}
                                    </p>
                                    {/* <p className="flex items-center gap-2">
                                        <FaExpand /> Playback Rate: {details.playbackRate}x
                                    </p> */}
                                    {/* <p className="flex items-center gap-2">
                                        <MdTimer /> Duration: {formatTime(details.duration)}
                                    </p> */}
                                    <p className="flex items-center gap-2">
                                        {details.isMuted ? <FaVolumeMute /> : <FaVolumeUp />} Volume: {(details.volume * 100).toFixed(0)}%
                                    </p>
                                    <p className="flex items-center gap-2">
                                        {details.isPaused ? <FaPause /> : <FaPlay />} Status: {details.isPaused ? 'Paused' : 'Playing'}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        {details.isMuted ? <FaVolumeMute className="text-red-600" /> : <FaVolumeUp className="text-green-600" />}
                                        Muted: {details.isMuted ? 'Yes' : 'No'}
                                    </p>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SideBar;
