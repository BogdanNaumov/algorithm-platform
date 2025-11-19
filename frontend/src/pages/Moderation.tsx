import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../service/api';
import { ModeratedAlgorithm } from '../types';
import { ALGORITHM_STATUS_DISPLAY, ALGORITHM_STATUS_COLORS } from '../utils/constants';
import './Moderation.css';

const Moderation: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<ModeratedAlgorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<ModeratedAlgorithm | null>(null);
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchModerationAlgorithms();
  }, [activeTab]);

  const fetchModerationAlgorithms = async () => {
    try {
      setLoading(true);
      setError('');

      let algorithmsData: ModeratedAlgorithm[] = [];
      
      if (activeTab === 0) {
        // Алгоритмы на модерации
        algorithmsData = await apiService.getModerationAlgorithms();
      } else {
        // Все алгоритмы
        algorithmsData = await apiService.getAllAlgorithms();
      }
      
      setAlgorithms(algorithmsData);
    } catch (err) {
      console.error('Error fetching moderation algorithms:', err);
      if ((err as any).response?.status === 403) {
        setError('У вас нет прав для доступа к модерации');
      } else if ((err as any).response?.status === 404) {
        setError('Эндпоинт модерации не найден. Возможно, требуется настройка бэкенда.');
      } else {
        setError('Не удалось загрузить алгоритмы для модерации');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModerationDialog = (algorithm: ModeratedAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    setRejectionReason('');
    setModerationDialogOpen(true);
  };

  const handleCloseModerationDialog = () => {
    setModerationDialogOpen(false);
    setSelectedAlgorithm(null);
    setRejectionReason('');
  };

  const moderateAlgorithm = async (status: 'approved' | 'rejected') => {
    if (!selectedAlgorithm) return;

    setActionLoading(true);
    try {
      await apiService.moderateAlgorithm(selectedAlgorithm.id, {
        status,
        rejection_reason: status === 'rejected' ? rejectionReason : ''
      });
      
      // Удаляем алгоритм из списка после модерации
      setAlgorithms(prev => prev.filter(alg => alg.id !== selectedAlgorithm.id));
      handleCloseModerationDialog();
      
      setError('');
    } catch (err) {
      console.error('Error moderating algorithm:', err);
      setError('Не удалось выполнить модерацию');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return ALGORITHM_STATUS_COLORS[status as keyof typeof ALGORITHM_STATUS_COLORS] || '#6b7280';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Улучшенная проверка прав доступа
  const hasModerationAccess = () => {
    if (!user) return false;
    
    // Проверяем различные возможные поля, которые могут указывать на права модератора/администратора
    const userAny = user as any;
    
    // Проверяем поле role
    if (user.role === 'moderator' || user.role === 'admin') return true;
    
    // Проверяем другие возможные поля
    if (userAny.is_staff || userAny.is_superuser || userAny.is_moderator) return true;
    
    // Проверяем группы пользователя
    if (userAny.groups && (
      userAny.groups.includes('Модераторы') || 
      userAny.groups.includes('Moderators') ||
      userAny.groups.includes('Администраторы') ||
      userAny.groups.includes('Administrators')
    )) return true;
    
    return false;
  };

  // Проверяем права доступа
  if (!user) {
    return (
      <div className="moderation-page">
        <div className="error-container">
          <div className="error-icon">🔒</div>
          <div className="error-text">
            Для доступа к панели модерации необходимо авторизоваться.
          </div>
          <Link to="/login" className="primary-btn" style={{marginTop: '1rem'}}>
            Войти в систему
          </Link>
        </div>
      </div>
    );
  }

  if (!hasModerationAccess()) {
    return (
      <div className="moderation-page">
        <div className="error-container">
          <div className="error-icon">🚫</div>
          <div className="error-text">
            У вас нет прав для доступа к этой странице. Только модераторы и администраторы могут просматривать эту страницу.
            <br /><br />
            Ваша роль: {user.role || 'не указана'}
            <br />
            Обратитесь к администратору для получения прав модератора.
          </div>
        </div>
      </div>
    );
  }

  const pendingAlgorithms = algorithms.filter(alg => alg.status === 'pending');
  const displayAlgorithms = activeTab === 0 ? pendingAlgorithms : algorithms;

  return (
    <div className="moderation-page">
      <div className="moderation-header">
        <h1 className="moderation-title">Панель модерации</h1>
        <p className="moderation-subtitle">
          Здесь вы можете просматривать и модерировать алгоритмы, отправленные пользователями.
        </p>
        <div className="user-info">
          Вы вошли как: <strong>{user.username}</strong> (Роль: {user.role || 'не указана'})
        </div>
      </div>

      {error && (
        <div className={`error-banner ${error.includes('У вас нет прав') ? 'error' : 'warning'}`}>
          <div className="error-banner-content">
            <span className="error-banner-icon">⚠️</span>
            <span className="error-banner-text">{error}</span>
            <button 
              className="error-banner-close"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="moderation-tabs">
        <button 
          className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => setActiveTab(0)}
        >
          На модерации ({pendingAlgorithms.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          Все алгоритмы
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Загрузка...</div>
        </div>
      ) : activeTab === 0 && pendingAlgorithms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3 className="empty-title">Нет алгоритмов для модерации</h3>
          <p className="empty-description">
            Все алгоритмы прошли модерацию. Новые появления появятся здесь автоматически.
          </p>
        </div>
      ) : (
        <div className="algorithms-list">
          {displayAlgorithms.map((algorithm) => (
            <div key={algorithm.id} className="moderation-card">
              <div className="card-header">
                <div className="card-title-section">
                  <div className="title-row">
                    <h3 className="algorithm-title">
                      <Link to={`/algorithm/${algorithm.id}`}>{algorithm.title}</Link>
                    </h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(algorithm.status) }}
                    >
                      {ALGORITHM_STATUS_DISPLAY[algorithm.status]}
                    </span>
                  </div>
                  
                  <div className="algorithm-meta">
                    <span className="meta-item">
                      <span className="meta-label">Автор:</span>
                      <span className="meta-value">{algorithm.author_name}</span>
                    </span>
                    <span className="meta-divider">•</span>
                    <span className="meta-item">
                      <span className="meta-label">Создан:</span>
                      <span className="meta-value">
                        {new Date(algorithm.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </span>
                  </div>

                  {algorithm.tags.length > 0 && (
                    <div className="algorithm-tags">
                      {algorithm.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <p className="algorithm-description">
                    {truncateText(algorithm.description, 200)}
                  </p>

                  <div className="code-info">
                    <span className="code-icon">💻</span>
                    <span className="code-text">
                      Код: {algorithm.code?.length || 0} символов
                    </span>
                  </div>

                  {algorithm.status === 'rejected' && algorithm.rejection_reason && (
                    <div className="rejection-reason">
                      <strong>Причина отклонения:</strong>
                      <p>{algorithm.rejection_reason}</p>
                    </div>
                  )}

                  {algorithm.moderated_by && (
                    <div className="moderation-info">
                      <span className="moderated-by">
                        Модератор: {algorithm.moderated_by}
                        {algorithm.moderated_at && (
                          <> • {new Date(algorithm.moderated_at).toLocaleDateString('ru-RU')}</>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {algorithm.status === 'pending' && (
                  <div className="moderation-actions">
                    <button
                      className="action-btn approve-btn"
                      onClick={() => handleOpenModerationDialog(algorithm)}
                    >
                      <span className="btn-icon">✓</span>
                      Одобрить
                    </button>
                    <button
                      className="action-btn reject-btn"
                      onClick={() => handleOpenModerationDialog(algorithm)}
                    >
                      <span className="btn-icon">✕</span>
                      Отклонить
                    </button>
                    <Link
                      to={`/algorithm/${algorithm.id}`}
                      className="action-btn details-btn"
                      target="_blank"
                    >
                      <span className="btn-icon">👁️</span>
                      Подробнее
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Диалог модерации */}
      {moderationDialogOpen && (
        <div className="modal-overlay">
          <div className="moderation-modal">
            <div className="modal-header">
              <h3 className="modal-title">Модерация алгоритма</h3>
              <button className="modal-close" onClick={handleCloseModerationDialog}>×</button>
            </div>
            
            <div className="modal-content">
              <h4 className="algorithm-name">{selectedAlgorithm?.title}</h4>
              <p className="algorithm-author">
                Автор: {selectedAlgorithm?.author_name}
              </p>
              
              <div className="rejection-reason-input">
                <label htmlFor="rejectionReason" className="input-label">
                  Причина отклонения
                </label>
                <textarea
                  id="rejectionReason"
                  className="reason-textarea"
                  placeholder="Укажите причину, если отклоняете алгоритм..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
                <p className="input-helper">
                  Обязательно для заполнения при отклонении
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="modal-btn cancel-btn"
                onClick={handleCloseModerationDialog}
                disabled={actionLoading}
              >
                Отмена
              </button>
              <button
                className="modal-btn approve-modal-btn"
                onClick={() => moderateAlgorithm('approved')}
                disabled={actionLoading}
              >
                <span className="btn-icon">✓</span>
                Одобрить
              </button>
              <button
                className="modal-btn reject-modal-btn"
                onClick={() => moderateAlgorithm('rejected')}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                <span className="btn-icon">✕</span>
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moderation;