import React, { useState } from "react";
import "./FileUploadModal.css";
import { useNavigate } from "react-router-dom";

const FileUploadModal = ({ onFileUpload }) => {  // Передаём onFileUpload как пропс
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      // Сохранение файла через prop-функцию
      if (onFileUpload) {
        onFileUpload(uploadedFile);
      }
    }
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleContinue = () => {
    if (file) {
      navigate("/select-patient", { state: { file } });  // Передача файла через navigate
    }
  };

  return (
    <div className="file-upload-modal">
      <div className="file-upload">
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="file-input" className="upload-label">
          {file ? (
            <div className="file-info-relative">
              <span className="file-name-centered">{file.name}</span>
              <button className="remove-file-abs" onClick={handleFileRemove}>❌</button>
            </div>
          ) : (
            <span className="upload-text">Выберите файл</span>
          )}

        </label>
      </div>
      <button
        className="continue-button"
        onClick={handleContinue}
        disabled={!file}
      >
        Продолжить
      </button>
    </div>
  );
};

export default FileUploadModal;
