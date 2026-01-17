import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: { _id: string; title: string };
  questions: {
    question: string;
    options: string[];
  }[];
  duration: number;
  passingScore: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  passingScore: number;
}

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && user) {
      fetchQuiz();
    }
  }, [id, user]);

  useEffect(() => {
    if (quiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, quiz, isSubmitted]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ENDPOINTS.QUIZ.DETAIL(id), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.error) {
        setError(res.data.error);
        setLoading(false);
        return;
      }

      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(-1));
      setTimeLeft(res.data.duration * 60); // Convert minutes to seconds
      setLoading(false);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to load quiz');
      }
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(API_ENDPOINTS.QUIZ.SUBMIT(id), {
        answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResult(res.data);
      setIsSubmitted(true);

      // Show result popup
      setTimeout(() => {
        if (res.data.passed) {
          alert(`🎉 Excellent! You scored ${res.data.score}%. Keep up the great work!`);
        } else {
          alert(`📚 You scored ${res.data.score}%. Keep studying and try again!`);
        }
      }, 500);
    } catch (err) {
      alert('Failed to submit quiz');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Login to take this quiz</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Quiz</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Not Available</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (isSubmitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              result.passed
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}>
              {result.passed ? (
                <CheckCircle className="h-12 w-12 text-white" />
              ) : (
                <XCircle className="h-12 w-12 text-white" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {result.passed ? '🎉 Quiz Completed!' : '📚 Quiz Completed'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.score}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Your Score</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result.correctAnswers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Correct Answers</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{result.totalQuestions}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Questions</div>
              </div>
            </div>

            <div className={`p-6 rounded-xl mb-8 ${
              result.passed
                ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700'
                : 'bg-gradient-to-r from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 border border-yellow-200 dark:border-yellow-700'
            }`}>
              <h2 className="text-xl font-bold mb-2">
                {result.passed ? 'Excellent Work! 🎉' : 'Keep Studying! 📚'}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {result.passed
                  ? `Congratulations! You passed the quiz with ${result.score}%. Great job!`
                  : `You scored ${result.score}%. The passing score is ${result.passingScore}%. Keep studying and try again!`
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate(`/courses/${quiz.course._id ? quiz.course._id : ''}`)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Course: {quiz.course.title}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {quiz.questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(currentQuestion, index)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-gray-900 dark:text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answers[currentQuestion] === -1}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Submit Quiz
              <CheckCircle className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuizPage;