"use client";
import { useQuery } from "@tanstack/react-query";
import "./gallery.css";
import { useSession } from "@/hooks/use-session";
import { getMedia } from "@/actions/media";

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export default function App() {
  const { user } = useSession();
  const { data: images = [], isFetching } = useQuery({
    queryKey: ["media", user.userId],
    queryFn: () => getMedia(1),
  });

  const vertical = [4, 5, 7, 12, 15, 20];

  /*const images = Array.from({ length: 20 }, (v, k) => ({
    alt: "img" + k,
    caption: "caption" + k,
    src: "/assets/images/img" + (k + 1) + ".jpg",
    orientation: vertical.includes(k+1) ? 'vertical' : 'horizontal'
  }));  */

  return (
    <div className="container1">
      {images.map((image) => {
        return (
          <div
            key={image.id}
            //href={image.file}
            //target="_blank"
            className={image.orientation}
          >
            <img src={image.file} alt={image.name} />
          </div>
        );
      })}
    </div>
  );
}
