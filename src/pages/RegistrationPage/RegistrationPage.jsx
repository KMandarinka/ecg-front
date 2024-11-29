import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message, Card } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Для навигации
import "./RegistrationPage.css";

const { Title } = Typography;

const RegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  const onFinish = (values) => {
    console.log("Received values:", values);
    setLoading(true);

    // Заглушка для проверки
    setTimeout(() => {
      setLoading(false);
      message.success("Регистрация успешна!");
      navigate("/"); // Перенаправление на LoginPage после успешной регистрации
    }, 1500);
  };

  const handleLoginClick = () => {
    navigate("/"); // Перенаправление на LoginPage
  };

  return (
    <div className="registration-page">
        <div className="registration-container">
  {/* Фон с анимацией линии */}
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
  

      <Card className="registration-card">
        <Title level={2} className="registration-title">
          Регистрация
        </Title>
        <Form
          name="registration_form"
          className="registration-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Введите имя пользователя!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Имя пользователя"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Введите электронную почту!" },
              { type: "email", message: "Введите корректный адрес электронной почты!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Электронная почта"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Введите пароль!" },
              { min: 6, message: "Пароль должен быть не менее 6 символов!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Вы должны согласиться с условиями!")),
              },
            ]}
          >
            <Checkbox>
              Я принимаю <a href="#">условия использования</a>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              className="back-to-login-button"
              onClick={handleLoginClick}
              block
            >
              Назад к авторизации
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </div>
  );
};

export default RegistrationPage;
