import React, { useState } from "react";
import "./FileUploadModal.css";
import { useNavigate } from "react-router-dom";

const FileUploadModal = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Хук для навигации

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleContinue = () => {
    if (file) {
      console.log("Файл загружен:", file);
      // Add your file upload logic here
      navigate("/select-patient"); // Переход на страницу выбора пациента
    }
  };

  return (
    <div className="file-upload-modal">
      {/* <h2>Загрузить файл</h2> */}
      <div className="file-upload">
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="file-input" className="upload-label">
          {file ? (
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <button className="remove-file" onClick={handleFileRemove}>
                ❌
              </button>
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
