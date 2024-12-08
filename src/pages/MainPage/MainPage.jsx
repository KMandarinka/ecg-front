import React from "react";
import { Layout, Menu, Input, Row, Col, Avatar, Dropdown } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import "./MainPage.css"; // Импорт кастомных стилей
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import MainComponent from "../../components/MainComponent/MainComponent.jsx";
import FileUploadModal from "../../components/FileUploadModal/FileUploadModal.jsx";

const { Header } = Layout;

const MainPage = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div>
    <AppHeader></AppHeader>
    <MainComponent></MainComponent>
    <FileUploadModal></FileUploadModal>
    </div>
  );
};

export default MainPage;
