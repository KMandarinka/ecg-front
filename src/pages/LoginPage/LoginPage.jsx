import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Используется для перехода на другую страницу
import "./LoginPage.css";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  const onFinish = (values) => {
    console.log("Received values:", values);
    setLoading(true);

    // Заглушка для проверки
    setTimeout(() => {
      setLoading(false);
      if (values.username === "admin" && values.password === "password") {
        message.success("Успешный вход!");
      } else {
        message.error("Неверное имя пользователя или пароль.");
      }
    }, 1000);
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Перенаправление на страницу регистрации
  };

  return (
    <div className="login-page">
      {/* Фоновая анимация ЭКГ */}
      <div className="ecg-background">
        <svg
          className="ecg-line"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          <path
            className="ecg-path"
            d="M0,50 L10,50 L20,30 L30,70 L40,50 L60,50 L70,30 L80,50 L100,50 L110,30 L120,70 L130,50 L140,50 L160,50 L170,30 L180,50 L200,50"
          />
        </svg>
      </div>
      <Card className="login-card">
        <Title level={2} className="login-title">
          Авторизация
        </Title>
        <Form
          name="login_form"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Введите имя пользователя!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Имя пользователя"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введите пароль!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              Войти
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              className="register-form-button"
              onClick={handleRegisterClick}
              block
            >
              Регистрация
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
