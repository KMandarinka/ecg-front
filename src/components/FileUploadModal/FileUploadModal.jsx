import React, { useState } from 'react';

const ModelComponent = () => {
  const [file, setFile] = useState(null);

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
      console.log('Файл загружен:', file);
      // Действие при продолжении (например, отправка файла на сервер)
    }
  };

  return (
    <div className="model-component">
      <h2>Загрузить файл</h2>

      <div className="file-upload">
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" className="upload-label">
          {file ? (
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <button className="remove-file" onClick={handleFileRemove}>❌</button>
            </div>
          ) : (
            <span className="upload-text">Выберите файл</span>
          )}
        </label>
      </div>

      {file && (
        <div className="file-preview">
          <span>Иконка файла: </span>
          <img src="/path/to/file-icon.png" alt="file-icon" className="file-icon" />
        </div>
      )}

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

export default ModelComponent;
