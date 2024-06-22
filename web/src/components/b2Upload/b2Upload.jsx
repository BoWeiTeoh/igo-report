import React, { useEffect, useState } from "react";
import showToast from "../../helpers/showToast";
import "./b2Upload.css";
import clsx from "clsx";

const B2Upload = ({
                    disabled,
                    onUpload,
                    imgUrl,
                    placeholderImg,
                    isEdit,
                    height,
                    width,
                    id,
                    className,
                    isError,
                    errorLabel,
                    errorStyle
                  }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState(imgUrl);

  // preview image from props
  useEffect(() => {
    setPreview(imgUrl);
  }, [imgUrl]);

  // preview image from new selected file
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const fileObj = e.target.files[0];
      const fileSize = fileObj.size;
      const fileKb = fileSize / 1024;

      if (fileKb > 3000) {
        showToast("File size cannot exceed 3mb");
        return null;
      }

      let validFileType = "(jpg|jpeg|png)";
      const validFileTypeRegex = new RegExp(`image/${validFileType}$`, "i");
      if (!validFileTypeRegex.test(fileObj.type)) {
        showToast(`Please upload supported image type. ${validFileType}`, true);
        return null;
      }

      setSelectedFile(fileObj);
      return handleUpload(fileObj);
    } else {
      showToast("No file selected", true);
    }
  };

  const handleUpload = async (fileObj) => {
    try {
      onUpload && (await onUpload(fileObj));
    } catch (e) {
      showToast(e, 1);
    }
  };

  const handleClearImg = () => {
    setPreview(null);
  };

  let editNode, imgNode;
  if (isEdit) {
    editNode = (
      <>
        {!imgUrl && <span className={"btn btn-primary btn-sm"}>Upload</span>}
        {imgUrl && (
          <span className={"btn btn-secondary btn-sm"} onClick={handleClearImg}>
            Remove
          </span>
        )}
      </>
    );
  }

  if (preview) {
    imgNode = <img src={preview} className={"b2upload-image"} alt={"img"} />;
  } else if (placeholderImg) {
    imgNode = <img src={placeholderImg} className={"b2upload-placeholder"} alt={"placeholder"} />;
  }

  return (
    <>
      <div className={clsx("b2upload pointer", className)}>
        <input
          style={{ display: "none" }}
          id={id}
          type={"file"}
          name={"file"}
          disabled={disabled}
          onChange={handleFileChange}
        />
        <label
          htmlFor={id}
          className={"b2upload-preview pointer"}
          style={{
            height,
            width
          }}
        >
          {imgNode}
          {editNode}
        </label>
      </div>
      <div style={errorStyle} className={clsx("my-2", isError && errorLabel && !preview ? "visible" : "invisible")}>
        <span style={{ color: "red" }}>{errorLabel}</span>
      </div>
    </>
  );
};

export default B2Upload;
