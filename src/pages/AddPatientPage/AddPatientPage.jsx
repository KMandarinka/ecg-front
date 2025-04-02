import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddPatientPage.module.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { ReactComponent as BackIcon } from '../../assets/back.svg'; // Иконка "Закрыть"

const AddPatientPage = () => {
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   name: "",
  //   surname: "",
  //   //patronymic: "",
  //   birthday: "",
  //   //weight: "",
  //   //height: "",
  //   //diagnosis: "",
  //   //phone: "",
  //   //email: ""
  // });
  const [formData, setFormData] = useState({
    birthday: "",
    name: "",
    surname: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      var token = localStorage.getItem("token");

      // Преобразование даты в формат ISO 8601
      const birthdayDate = new Date(formData.birthday);
      const formattedBirthday = birthdayDate.toISOString(); // Форматирует в ISO (например, "1998-10-10T15:04:05Z")

      const response = await fetch('http://localhost:4000/api/v1/patients/create', {
        method: 'POST',
        headers: {
          "Authorization": `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthday: formattedBirthday,
          name: formData.name,
          surname: formData.surname
        }),
      });

      if (response.status === 201) {
        navigate("/select-patient");
      } else {
        const data = await response.json();
        console.error('Ошибка при сохранении пациента:', data);
      }
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  };

  return (
    <div className={styles["app-add-patient-page"]}>
      <AppHeader />
      <div className={styles["app-header-container"]}>
        <span className={styles["app-breadcrumb"]}>Главная > Ввод данных ></span>
        <span className={styles["app-contact-link"]}>Остались вопросы? Напишите нам</span>
      </div>

      <div className={styles["app-info-container"]}>
        <h1 className={styles["app-h1"]}>Введите данные нового пациента</h1>
        <button
          className={styles["app-back-button"]}
          onClick={() => navigate("/select-patient")}
        >
          <BackIcon className={styles["app-back-icon"]} />
          <span>Назад к поиску пациентов</span>
        </button>
      </div>

      <div className={styles["app-form-container"]}>
        <form>
          <div className={styles["app-form-grid"]}>
            <label className={styles["app-form-label"]}>
              Имя:
              <input 
                className={styles["app-form-input"]} 
                type="text" 
                name="name" 
                placeholder="Имя" 
                value={formData.name} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Фамилия:
              <input 
                className={styles["app-form-input"]} 
                type="text" 
                name="surname" 
                placeholder="Фамилия" 
                value={formData.surname} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Отчество:
              <input 
                className={styles["app-form-input"]} 
                type="text" 
                name="patronymic" 
                placeholder="Отчество" 
                value={formData.patronymic} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Дата рождения:
              <input 
                className={styles["app-form-input"]} 
                type="date" 
                name="birthday" 
                value={formData.birthday} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Вес (кг):
              <input 
                className={styles["app-form-input"]} 
                type="number" 
                name="weight" 
                placeholder="Вес" 
                value={formData.weight} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Рост (см):
              <input 
                className={styles["app-form-input"]} 
                type="number" 
                name="height" 
                placeholder="Рост" 
                value={formData.height} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Диагноз:
              <input 
                className={styles["app-form-input"]} 
                type="text" 
                name="diagnosis" 
                placeholder="Диагноз" 
                value={formData.diagnosis} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Телефон:
              <input 
                className={styles["app-form-input"]} 
                type="tel" 
                name="phone" 
                placeholder="Телефон" 
                value={formData.phone} 
                onChange={handleChange} 
              />
            </label>
            <label className={styles["app-form-label"]}>
              Почта:
              <input 
                className={styles["app-form-input"]} 
                type="email" 
                name="email" 
                placeholder="Почта" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </label>
          </div>
          <button
            className={styles["app-form-button"]}
            type="button"
            onClick={handleSave}
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientPage;
