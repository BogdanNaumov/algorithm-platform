import React from 'react';

const Profile: React.FC = () => {
  const user = {
    username: 'Иван Иванов',
    email: 'ivan@example.com',
    role: 'author',
    algorithmsCount: 3
  };

  return (
    <div className="profile-page">
      <h1>Личный кабинет</h1>
      
      <div className="user-info">
        <h2>Информация о пользователе</h2>
        <p><strong>Имя:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Роль:</strong> {user.role === 'author' ? 'Автор алгоритмов' : 'Потребитель'}</p>
        <p><strong>Опубликовано алгоритмов:</strong> {user.algorithmsCount}</p>
      </div>

      <div className="user-info">
        <h2>Мои алгоритмы</h2>
        <p>Здесь будет список ваших алгоритмов</p>
      </div>

      <div className="user-info">
        <h2>История покупок</h2>
        <p>Здесь будет история приобретенных алгоритмов</p>
      </div>
    </div>
  );
};

export default Profile;