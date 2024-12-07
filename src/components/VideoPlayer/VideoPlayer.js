// src/components/VideoPlayer/VideoPlayer.js
import React, { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId, vnname,ep }) => {
    const [videoURL, setVideoURL] = useState('');
    const [subtitles, setSubtitles] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false); // New state for fullscreen
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const subtitlesRef = useRef(null);

    useEffect(() => {
        const fetchVideo = async () => {
            // const response = await fetch(`http://localhost:1412/videos/${videoId}`);
            const response = await fetch(`http://localhost:1412/api/admin/episode/video/${videoId}`);
            const blob = await response.blob();
            setVideoURL(URL.createObjectURL(blob));
        };

        const fetchSubtitle = async () => {
            const response = await fetch(`http://localhost:1412/api/admin/episode/sub/${videoId}`);
            // const response = await fetch(`http://localhost:1412/videos/${videoId}/subtitle`);
            const text = await response.text();
            const parsedSubtitles = parseSubtitles(text);
            setSubtitles(parsedSubtitles);
        };

        fetchVideo();
        fetchSubtitle();
    }, [videoId]);

    const parseSubtitles = (subtitleText) => {
        const subtitles = [];
        const lines = subtitleText.split('\n');
        let subtitle = { start: 0, end: 0, text: '' };

        for (const line of lines) {
            if (line.includes('-->')) {
                const [start, end] = line.split(' --> ').map(time => {
                    const [hours, minutes, seconds] = time.split(':');
                    const [sec, ms] = seconds.split(',');
                    return (+hours * 3600) + (+minutes * 60) + (+sec) + (+ms / 1000);
                });
                subtitle.start = start;
                subtitle.end = end;
            } else if (line.trim() === '') {
                subtitles.push(subtitle);
                subtitle = { start: 0, end: 0, text: '' };
            } else {
                subtitle.text += line + '\n';
            }
        }

        return subtitles;
    };

    const updateSubtitles = () => {
        const currentTime = videoRef.current.currentTime;
        let subtitleText = '';
        for (const subtitle of subtitles) {
            if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
                subtitleText = subtitle.text.trim();
                break;
            }
        }
        subtitlesRef.current.textContent = subtitleText;
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
        setShowPlayButton(false);
    };

    const handleSeek = (seconds) => {
        videoRef.current.currentTime += seconds;
    };

    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
        } else {
            videoRef.current.parentElement.requestFullscreen();
            setIsFullscreen(true);
        }
    };

    const handleProgressBarClick = (event) => {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = (clickX / progressBarRef.current.offsetWidth) * 100;
        videoRef.current.currentTime = (percentage / 100) * videoRef.current.duration;
    };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
        videoRef.current.volume = event.target.value;
    };

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            setShowPlayButton(false);
            clearTimeout(hideControlsTimeout);
            hideControlsTimeout = setTimeout(() => setShowControls(false), 3000);
        };

        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    handleSeek(-5);
                    break;
                case 'ArrowRight':
                    handleSeek(5);
                    break;
                case 'ArrowUp':
                    videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
                    setVolume(videoRef.current.volume);
                    break;
                case 'ArrowDown':
                    videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
                    setVolume(videoRef.current.volume);
                    break;
                case 'f':
                    handleFullscreen();
                    break;
                default:
                    break;
            }
        };

        let hideControlsTimeout;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyDown);
            clearTimeout(hideControlsTimeout);
        };
    }, [isPlaying]);

    useEffect(() => {
        const videoElement = videoRef.current;
        videoElement.addEventListener('timeupdate', updateSubtitles);
        return () => {
            videoElement.removeEventListener('timeupdate', updateSubtitles);
        };
    }, [subtitles]);

    return (
        <div className="video-container">
            <video ref={videoRef} src={videoURL} onClick={handlePlayPause} />
            <div ref={subtitlesRef} className="subtitles"></div>
            {showControls && (
                <>
                  <button onClick={handlePlayPause} className="control-button control-button_main">{isPlaying ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}</button>
                <div className="controls">
                    <button onClick={handlePlayPause} className="control-button">{isPlaying ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}</button>
                    <button onClick={() => handleSeek(-10)} className="control-button"><i class="fa-solid fa-backward"></i></button>
                    <button onClick={() => handleSeek(10)} className="control-button"><i class="fa-solid fa-forward"></i></button>
                    <div className="progress-bar" ref={progressBarRef} onClick={handleProgressBarClick}>
                        <div className="progress-bar-inner" style={{ width: `${(videoRef.current?.currentTime / videoRef.current?.duration) * 100}%` }}></div>
                    </div>
                    <div className="volume-container">
                        <span className="volume-icon"><i class="fa-solid fa-volume-high"></i></span>
                        <div className="volume-slider">
                            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
                        </div>
                    </div>
                    <button onClick={handleFullscreen} className="control-button">
                        {isFullscreen ? <i class="fa-solid fa-compress"></i> : <i class="fa-solid fa-expand"></i>}
                    </button>
                    <button onClick={() => { const link = document.createElement('a'); link.href = videoURL; link.download = `${vnname}-${ep}-[Vietsub].mp4`; link.click(); }} className="control-button"><i class="fa-solid fa-cloud-arrow-down"></i></button>
                </div>
                </>
            )}
            {showPlayButton && !isPlaying && (
                <button className="play-button show" onClick={handlePlayPause}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default VideoPlayer;
