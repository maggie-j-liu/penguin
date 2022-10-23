import { useState } from "react";

export const ParticipantWaiver = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [done, setDone] = useState(false);

  return !done ? (
    <div>
      <input
        name="image"
        type="file"
        className="mx-auto block w-full"
        // accept="image/*, video*/"
        accept="image/png, image/jpeg, image/jpg"
        multiple
        onChange={async (e) => {
          if (e.target.files) {
            setUploadingImage(true);
            const fd = new FormData();
            Array.from(e.target.files).forEach((file, i) => {
              fd.append(file.name, file);
            });
            const media = await fetch("/api/upload-files", {
              method: "POST",
              body: fd,
            });
            const newFiles = await media.json();
            // setFiles((f) => [...f, ...newFiles]);
            e.target.value = "";
            setUploadingImage(false);
            // console.log(e.target.files);
          }
        }}
      />
      {uploadingImage ? (
        <p className="dark:text-gray-300">Uploading image(s)...</p>
      ) : null}
    </div>
  ) : (
    <div>
      <h1 className="text-2xl font-black">Waiver uploaded!</h1>
    </div>
  );
};
