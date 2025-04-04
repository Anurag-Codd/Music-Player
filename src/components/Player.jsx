import React, { useEffect, useRef, useState } from "react";
import { Card, ProgressBar, Button, CloseButton } from "react-bootstrap";
import {
  HiEllipsisHorizontal,
  HiMiniBackward,
  HiMiniPlay,
  HiMiniPause,
  HiMiniForward,
  HiSpeakerWave,
  HiSpeakerXMark,
} from "react-icons/hi2";

const Player = ({ currentTrack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const intervalRef = useRef(null);
  console.log(intervalRef)

  const convertDuration = (str) => {
    if (!str) return 0;
    const [min, sec] = str.split(":").map(Number);
    return min * 60 + sec;
  };

  const durationInSeconds = convertDuration(currentTrack?.duration);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const handlePlayClick = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationInSeconds) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleProgressClick = (e) => {
    const bar = e.target;
    const clickX = e.nativeEvent.offsetX;
    const barWidth = bar.clientWidth;
    const newTime = (clickX / barWidth) * durationInSeconds;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrentTime(0);
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= durationInSeconds) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  }, [durationInSeconds]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const PlayerUI = () => (
    <Card className="d-flex flex-column justify-content-center bg-transparent text-white border-0 p-2 p-lg-5 h-100">
      <Card.Body className="d-flex flex-column gap-4 justify-content-center align-items-center">
        <div className="w-100 text-start">
          <Card.Title className="fs-4 fw-bold mb-1">{currentTrack?.title}</Card.Title>
          <Card.Text className="text-secondary fs-6">{currentTrack?.artistName}</Card.Text>
        </div>

        <div className="d-flex justify-content-center w-100">
          <img
            src={currentTrack?.thumbnail}
            alt="Cover"
            className="rounded-3"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              aspectRatio: "1",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="w-100" onClick={handleProgressClick} style={{ cursor: "pointer" }}>
          <ProgressBar
            now={currentTime}
            max={durationInSeconds}
            variant="primary"
            className="rounded-pill"
            style={{ height: "7px" }}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center gap-3 w-100">
          <Button variant="secondary" className="rounded-circle border-0 p-2">
            <HiEllipsisHorizontal size={20} />
          </Button>

          <div className="d-flex justify-content-center align-items-center gap-3 flex-grow-1">
            <Button className="border-0 bg-transparent">
              <HiMiniBackward size={20} />
            </Button>
            <Button
              onClick={handlePlayClick}
              variant="light"
              className="rounded-circle p-3 d-flex align-items-center justify-content-center"
            >
              {isPlaying ? <HiMiniPause size={24} /> : <HiMiniPlay size={24} />}
            </Button>
            <Button className="border-0 bg-transparent">
              <HiMiniForward size={20} />
            </Button>
          </div>

          <Button
            onClick={toggleMute}
            variant="secondary"
            className="rounded-circle border-0 p-2"
          >
            {isMuted ? <HiSpeakerXMark size={20} /> : <HiSpeakerWave size={20} />}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <div className="d-none d-md-block px-lg-5 mx-lg-5">
        <PlayerUI />
      </div>

      {!showFullPlayer && (
        <div
          className="d-md-none fixed-bottom bg-dark-subtle text-white p-2 d-flex justify-content-between align-items-center"
          onClick={() => setShowFullPlayer(true)}
          style={{ cursor: "pointer", zIndex: 1050 }}
        >
          <div className="d-flex align-items-center gap-2">
            <img
              src={currentTrack?.thumbnail}
              alt=""
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "0.25rem",
              }}
            />
            <div>
              <div className="fw-bold">{currentTrack?.title}</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                {currentTrack?.artistName}
              </div>
            </div>
          </div>
          {isPlaying ? <HiMiniPause size={20} /> : <HiMiniPlay size={20} />}
        </div>
      )}

      {showFullPlayer && (
        <div className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark text-white" >
          <div className="position-relative d-flex justify-content-between align-items-center">
            <CloseButton
            style={{ zIndex: 2000 }}
            variant="white"
              className="position-absolute end-0 top-0 m-3"
              onClick={() => setShowFullPlayer(false)}
            />
          </div>
          <PlayerUI />
        </div>
      )}
    </>
  );
};

export default Player;
