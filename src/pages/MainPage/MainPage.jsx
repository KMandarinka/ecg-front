// MainPage.jsx
import React, { useState } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import FileUploadModal from "../../components/FileUploadModal/FileUploadModal.jsx";
import MainComponent from "../../components/MainComponent/MainComponent.jsx";
import "./MainPage.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";

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
       
       <AppHeader />

      <MainComponent onShowModal={showModal} />
      <Modal
      visible={isModalVisible}
      footer={null}
      onCancel={handleModalClose}
      centered
      width={938}
      destroyOnClose
      closable={true}
      title="Загрузка файлов" // Добавляем кастомный заголовок
      className="custom-modal"
    >
      <FileUploadModal />
    </Modal>

    </div>
  );
};


export default MainPage;
