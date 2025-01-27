import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { generateVideoThumbnail } from "@/utils";
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import { useDebounce } from "@/hooks/useDebounce";
import { canvasPreview } from "./canvasPreview";

interface FileUploaderProps {
  onFileSelect: (data: { file: File; thumbNail: string }) => void;
  onFileChange?: (file: File) => void;
  allowedTypes?: string[];
  maxSize?: number;
  uploadText?: string;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function FileUploader(props: FileUploaderProps) {
  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
  const {
    onFileSelect,
    //onFileChange,
    allowedTypes = allowedFileTypes,
    maxSize = 1024 * 1024,
    uploadText,
  } = props;
  const [file, setFile] = useState<File>();
  const [output, setOutput] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);

  useDebounce(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          //scale,
          //rotate,
        )
      }
    },
    100,
    [completedCrop/*, scale, rotate*/],
  )

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (!uploadedFile) return;

    if (!allowedTypes.includes(uploadedFile.type)) {
      //alert("This file type is not supported !");
      //return;
    }

    if (uploadedFile.size > maxSize) {
      //alert("Uploaded file is too big !");
      //return;
    }

    /*if (event.target.files && event.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setFile(uploadedFile);
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(event.target.files[0]);
    }*/
    setFile(uploadedFile);

    if (uploadedFile.type.startsWith("video")) {
      const thumbnail = await generateVideoThumbnail(uploadedFile);
      if (imageRef && imageRef.current) {
        imageRef.current.src = thumbnail;
      }
    }
    /*if (onFileChange) {
      onFileChange(uploadedFile);
    }*/
  };

  const selectFile = () => {
    if (file) {
      onFileSelect({ file, thumbNail: imageRef.current!.src });
    }
  };

  const isImageFile = (type: string) => {
    return ["image/jpeg", "image/png"].includes(type);
  };

  const isVideoFile = (type: string) => {
    return ["video/mp4", "video/avi"].includes(type);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  };

  async function onDownloadCropClick() {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    )
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    })

    /*if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }
    blobUrlRef.current = URL.createObjectURL(blob)

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current
      hiddenAnchorRef.current.click()
    }*/
  }

  return (
    <div>
      {file ? (
        <div className="flex flex-col justify-center">
          {isImageFile(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              {/*<ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
                // minWidth={400}
                minHeight={100}
                // circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                />
              </ReactCrop>*/}
          
              {/*completedCrop && (
                <>
                  <div>
                  { completedCrop.width }
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        border: "1px solid black",
                        objectFit: "contain",
                        width: completedCrop.width,
                        height: completedCrop.height,
                      }}
                    />
                  </div>
                </>
              )*/}
            </div>
          )}

          {isVideoFile(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <img
                ref={imageRef}
                src="/assets/images/upload.png"
                width={"100%"}
              />
            </div>
          )}

          <div className="text-center">
            <Button size={"sm"} onClick={selectFile}>
              <Upload />
              {uploadText || "Upload file"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          Choose a file...
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
