import { PropsWithChildren, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
//import SpeedControl from "./speedcontrol";
import Player from "video.js/dist/types/player";

type VideoPlayerProps = { options: any; onReady?: (player: Player) => void };

export const VideoPlayer = (props: PropsWithChildren<VideoPlayerProps>) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player>(null);
  //const [playbackRate, setPlaybackRate] = useState(1);
  const { options, onReady } = props;
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current!.appendChild(videoElement);      

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  /*useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate(playbackRate);
    }
  }, [playbackRate]);*/

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  const addNote = (noteText: string) => {
    const currentTime = playerRef.current!.currentTime();
    setNotes([...notes, { time: currentTime as number, text: noteText }]);
  };

  return (
    <>
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
      {/*<div className="mt-2 flex gap-2">
        <SpeedControl onChange={(value: number) => setPlaybackRate(value)} />
        <input
          type="text"
          placeholder="Add a note..."
          onKeyDown={(e: any) => {
            if (e.key === "Enter" && e.target.value) {
              addNote(e.target.value);
              e.target.value = ""; // Clear input after adding
            }
          }}
        />
      </div>
      {notes.length > 0 &&
        notes.map((note, idx) => {
          return (
            <div style={{ marginTop: "20px" }} key={idx}>
              <span>At {note.time} :- </span>
              <span>{note.text}</span>
            </div>
          );
        })}*/}
    </>
  );
};

export default VideoPlayer;
