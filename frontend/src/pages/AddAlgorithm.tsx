import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

const AddAlgorithm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '#include <iostream>\n#include <vector>\n\nusing namespace std;\n\n// Ваш алгоритм здесь\nvoid yourAlgorithm() {\n    // Реализация алгоритма\n    cout << "Hello, Algorithm Platform!" << endl;\n}',
    tags: '',
    isPaid: false,
    price: '100',
    language: 'cpp',
    compiler: 'g++'
  });

  const [showPrice, setShowPrice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Данные формы:', formData);
    alert('Алгоритм отправлен на проверку!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCodeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      code: value
    }));
  };

  const togglePaid = () => {
    const newIsPaid = !formData.isPaid;
    setFormData(prev => ({
      ...prev,
      isPaid: newIsPaid,
      price: newIsPaid ? '100' : '0'
    }));
    
    if (newIsPaid) {
      setShowPrice(true);
    } else {
      // Задержка для анимации скрытия
      setTimeout(() => setShowPrice(false), 300);
    }
  };

  return (
    <div className="add-algorithm-page">
      <h1>Добавить новый алгоритм</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Название алгоритма</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите название алгоритма"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите алгоритм, его особенности и применение"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="language">Язык программирования</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="cpp">C/C++</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="compiler">Компилятор</label>
            <select
              id="compiler"
              name="compiler"
              value={formData.compiler}
              onChange={handleChange}
            >
              <option value="g++">g++ (GCC)</option>
              <option value="gcc">gcc (GCC)</option>
              <option value="clang">clang (LLVM)</option>
              <option value="clang++">clang++ (LLVM)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="code">Исходный код</label>
          <div className="code-editor-container">
            <CodeMirror
              value={formData.code}
              height="400px"
              extensions={[cpp()]}
              theme={oneDark}
              onChange={handleCodeChange}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightSpecialChars: true,
                syntaxHighlighting: true,
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Теги (через запятую)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="сортировка, C++, алгоритмы"
          />
        </div>

        <div className="form-group">
          <div className="paid-toggle-section">
            <div className="toggle-container">
              <span className="toggle-label">Платный алгоритм</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={togglePaid}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className={`price-input-wrapper ${showPrice ? 'visible' : 'hidden'}`}>
              <div className="price-input-container">
                <label htmlFor="price">Стоимость алгоритма</label>
                <div className="price-input-group">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    max="10000"
                    placeholder="100"
                    className="price-input"
                  />
                  <span className="currency">руб.</span>
                </div>
                <p className="price-hint">Укажите стоимость в рублях</p>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Отправить на проверку
        </button>
      </form>
    </div>
  );
};

export default AddAlgorithm;