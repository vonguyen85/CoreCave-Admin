import React, { useEffect, useRef } from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// core components
import Button from "components/CustomButtons/Button.js";

import defaultImage from "assets/img/image_placeholder.jpg";
import { uploadService } from "../../services/uploadService";

// eslint-disable-next-line react/prop-types
export default function ImageUpload({ value, onChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(value || defaultImage);
  const fileInput = useRef(null);
  async function uploadImage(fileChangeEvent) {
    const file = fileChangeEvent.target.files[0];
    let formData = new FormData();
    formData.append('photo', file, file.name);
    try {
      const response = await uploadService.uploadOne(formData);
      const baseUrl = response.config.baseURL;
      const url = baseUrl + response.data.url;
      setImagePreviewUrl(url);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    onChange(imagePreviewUrl);
  }, [imagePreviewUrl]);

  useEffect(() => {
    if (value) {
      setImagePreviewUrl(value);
    }
  }, [value]);
  return (
    <div className="fileinput text-center">
      <input type="file" onChange={(e) => uploadImage(e)} ref={fileInput} />
      <div className="thumbnail">
        {!imagePreviewUrl.toLowerCase().match(/\.(mp4|amv)$/)
          ? <img src={imagePreviewUrl} alt="..." />
          : <video width="300px" height="300px" src={imagePreviewUrl} alt="..." />
        }
      </div>
      <div>
        {value === null ? (
          <Button onClick={() => fileInput.current.click()}>
            Select image
          </Button>
        ) : (
          <span>
            <Button color="success" onClick={() => fileInput.current.click()}>
              Change
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object,
};
