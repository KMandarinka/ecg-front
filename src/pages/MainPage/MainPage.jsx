// MainPage.jsx
import React, { useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import FileUploadModal from "../../components/FileUploadModal/FileUploadModal.jsx";
import MainComponent from "../../components/MainComponent/MainComponent.jsx";
import "./MainPage.css";

const MainPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    console.log("Modal opened"); // Debug log
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    console.log("Modal closed"); // Debug log
  };

  return (
    <div className="main-page-container">
      <MainComponent onShowModal={showModal} />
      <Modal
        title="Загрузить файлы"
        visible={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
        destroyOnClose
      >
        <FileUploadModal />
      </Modal>
    </div>
  );
};

export default MainPage;
