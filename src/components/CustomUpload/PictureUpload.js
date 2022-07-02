/*eslint-disable*/
import React, { useEffect } from "react";

import defaultImage from "assets/img/default-avatar.png";
import { uploadService } from "services/uploadService";

export default function PictureUpload({ value, onChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(value || defaultImage);
  async function uploadImage (fileChangeEvent) {
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
    <div className="picture-container">
      <div className="picture">
        <img src={imagePreviewUrl} className="picture-src" alt="..." />
        <input type="file" onChange={(e) => uploadImage(e)} />
      </div>
      <h6 className="description">Choose Picture</h6>
    </div>
  );
}
