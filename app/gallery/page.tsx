"use client";
import { useQuery } from "@tanstack/react-query";
import "./gallery.css";
import { useSession } from "@/hooks/use-session";
import { getMedia } from "@/actions/media";

export default function App() {
  const { user } = useSession();
  const { data: images = [] } = useQuery({
    queryKey: ["media", user.userId],
    queryFn: () => getMedia(1),
  });

  return (
    <div className="container1">
      {images.map((image) => {
        return (
          <div
            key={image.id}
            //href={image.file}
            //target="_blank"
            className={image.orientation?.toLowerCase()}
          >
            <img src={image.file} alt={image.name} />
          </div>
        );
      })}
    </div>
  );
}
