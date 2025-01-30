"use client";
import { useQuery } from "@tanstack/react-query";
import "./gallery.css";
import { useSession } from "@/hooks/use-session";
import { getMedia } from "@/actions/media";
import { useState } from "react";
import { Media } from "@prisma/client";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

export default function App() {
  const [lightboxDisplay, setLightBoxDisplay] = useState(false);
  const [imageToShow, setImageToShow] = useState<Media>();
  const { user } = useSession();
  const { data: images = [] } = useQuery({
    queryKey: ["media", user.userId],
    queryFn: () => getMedia(1),
  });

  const showImage = (image: Media) => {
    //set imageToShow to be the one that's been clicked on
    setImageToShow(image); //set lightbox visibility to true
    setLightBoxDisplay(true);
  };

  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

  const showNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === imageToShow?.id);
    if (currentIndex >= images.length - 1) {
      setLightBoxDisplay(false);
    } else {
      let nextImage = images[currentIndex + 1];
      setImageToShow(nextImage);
    }
  };

  const showPrev = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === imageToShow?.id);
    if (currentIndex <= 0) {
      setLightBoxDisplay(false);
    } else {
      let nextImage = images[currentIndex - 1];
      setImageToShow(nextImage);
    }
  };

  return (
    <div className="">
      <div className="container1">
        {images.map((image) => {
          return (
            <div
              key={image.id}
              //href={image.file}
              //target="_blank"
              className={image.orientation?.toLowerCase()}
            >
              <img
                onClick={() => showImage(image)}
                src={image.file}
                alt={image.name}
              />
            </div>
          );
        })}
      </div>
      {lightboxDisplay && imageToShow ? (
        <div id="lightbox" onClick={hideLightBox}>
          <button onClick={showNext}>
            <ArrowBigLeft />
          </button>
          <img id="lightbox-img" src={imageToShow.file}></img>
          <button onClick={showPrev}>
            <ArrowBigRight />
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
