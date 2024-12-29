"use client";
import "./gallery.css";

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
  const vertical = [4, 5, 7, 12, 15, 20];

  const images = Array.from({ length: 20 }, (v, k) => ({
    alt: "img" + k,
    caption: "caption" + k,
    src: "/assets/images/img" + (k + 1) + ".jpg",
    orientation: vertical.includes(k+1) ? 'vertical' : 'horizontal'
  }));
  console.log(images);
  

  return (
    <div className="container1">
      {(images).map((image) => {
        return (
          <div key={image.alt} className={image.orientation}>
            <img src={image.src} alt={image.alt} />
          </div>
        );
      })}
    </div>
  );
}
