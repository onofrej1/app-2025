"use client";

import { useState } from "react";
import Editor from "@/components/rich-text/editor";
import React from "react";
import Videojs from "@/components/video/videojs";
import Player from "video.js/dist/types/player";

export default function Home() {
  //const [value, setValue] = useState("hello world ")

  const playerRef = React.useRef<Player>(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    experimentalSvgIcons: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: [
      {
        src: "http://localhost:3000/uploaded_files/v5.mp4",
        type: "video/mp4",
      },
    ],
    tracks: [
      {
        src: 'http://localhost:3000/test.vtt',
        kind:'captions',
        srclang: 'en',
        label: 'English',
        default: true,
      }
    ]
  };

  const handlePlayerReady = (player: Player) => {
    console.log("is ready");
    playerRef.current = player;

    player.on("waiting", () => {
      console.log("Player is waiting");
    });

    player.on("dispose", () => {
      console.log("Player will dispose");
    });
  };

  return (
    <div>
      {/*<Editor content={value} onChange={setValue} placeholder="Write your post here..." />*/}
      <Videojs options={videoJsOptions} onReady={handlePlayerReady} />      
    </div>
  );
}
