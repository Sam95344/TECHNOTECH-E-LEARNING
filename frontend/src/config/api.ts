// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://technotech-e-learning.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  COURSES: {
    LIST: `${API_BASE_URL}/api/courses`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/courses/${id}`,
    RATING: (id: string) => `${API_BASE_URL}/api/courses/${id}/rating`,
  },
  ADMIN: {
    USERS: `${API_BASE_URL}/api/admin/users`,
    COURSES: `${API_BASE_URL}/api/admin/courses`,
    COURSE_UPDATE: (id: string) => `${API_BASE_URL}/api/admin/courses/${id}`,
    COURSE_DELETE: (id: string) => `${API_BASE_URL}/api/admin/courses/${id}`,
  },
  ENROLL: {
    LIST: `${API_BASE_URL}/api/enroll`,
    CREATE: `${API_BASE_URL}/api/enroll`,
    DELETE: (id: string) => `${API_BASE_URL}/api/enroll/${id}`,
    PROGRESS: (id: string) => `${API_BASE_URL}/api/enroll/${id}/progress`,
    CERTIFICATE: (id: string) => `${API_BASE_URL}/api/enroll/${id}/certificate`,
  },
  QUIZ: {
    LIST: `${API_BASE_URL}/api/quiz`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/quiz/${id}`,
    SUBMIT: (id: string) => `${API_BASE_URL}/api/quiz/${id}/submit`,
    STUDENT: `${API_BASE_URL}/api/quiz/student`,
    CREATE: `${API_BASE_URL}/api/quiz`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/quiz/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/quiz/${id}`,
  },
  TRANSLATE: `${API_BASE_URL}/api/translate`,
};
