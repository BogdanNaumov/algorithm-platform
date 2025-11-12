import React, { useState } from 'react';
import { Algorithm } from '../types';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [algorithms] = useState<Algorithm[]>([
    {
      id: '1',
      title: 'Быстрая сортировка (Quick Sort)',
      description: 'Эффективный алгоритм сортировки со средней сложностью O(n log n). Идеален для больших массивов данных.',
      author: 'Иван Иванов',
      tags: ['сортировка', 'C++', 'рекурсия'],
      isPaid: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Алгоритм Дейкстры',
      description: 'Алгоритм для нахождения кратчайшего пути в графе с неотрицательными весами ребер.',
      author: 'Петр Петров',
      tags: ['графы', 'поиск пути', 'C++'],
      isPaid: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Двоичный поиск',
      description: 'Эффективный алгоритм поиска в отсортированном массиве со сложностью O(log n).',
      author: 'Мария Сидорова',
      tags: ['поиск', 'массивы', 'C++'],
      isPaid: false,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    }
  ]);

  return (
    <div className="home">
      <header className="search-header">
        <h1>Платформа алгоритмов</h1>
        <p>Найдите идеальное решение для вашей задачи</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск алгоритмов по названию, описанию или тегам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>Найти</button>
        </div>
      </header>

      <div className="filters">
        <select>
          <option>Все языки</option>
          <option>C/C++</option>
        </select>
        <select>
          <option>Все типы</option>
          <option>Бесплатные</option>
          <option>Платные</option>
        </select>
        <select>
          <option>Все категории</option>
          <option>Сортировка</option>
          <option>Поиск</option>
          <option>Графы</option>
        </select>
      </div>

      <div className="algorithms-grid">
        {algorithms.map(algorithm => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </div>
    </div>
  );
};

const AlgorithmCard: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => {
  return (
    <div className="algorithm-card">
      <h3>{algorithm.title}</h3>
      <p>{algorithm.description}</p>
      <div className="tags">
        {algorithm.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <div className="card-footer">
        <span className={`price ${algorithm.isPaid ? 'paid' : 'free'}`}>
          {algorithm.isPaid ? 'Платный' : 'Бесплатный'}
        </span>
        <button>Подробнее</button>
      </div>
    </div>
  );
};

export default Home;