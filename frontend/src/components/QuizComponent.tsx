import React, { useState, useRef } from 'react';
import '../css/quiz.css';
import { QuizQuestion, EvaluationResponse } from '../models/models';
import { quizService } from '../services/apiService';

const Quiz: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [evalUpdateTrigger, setEvalUpdateTrigger] = useState(0);

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);
      setQuizData([]);
      setQuizId(null);
      setEvaluation(null);
      const quiz = await quizService.generateQuiz(topic);
      if (quiz) {
        setQuizData(quiz.questions);
        setQuizId(quiz.quizId);
        setSelectedAnswers({});
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!quizId) return;
    
    try {
      setLoading(true);
      const results = await quizService.gradeQuiz(quizId, selectedAnswers);
      if (results) {
        setEvaluation(results);
        setEvalUpdateTrigger(prev => prev + 1); // Force re-render
      }
    } catch (error) {
      console.error('Failed to grade quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId: number, optionKey: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const renderQuestionCards = () => {
    return quizData.map((question) => {
      const questionFeedback = evaluation?.feedback.find(f => f.id === question.id);
      const correctAnswer = questionFeedback?.correctAnswer;

      return (
        <div key={`${question.id}-${evalUpdateTrigger}`} className="question-card">
          <h3>{question.text}</h3>
          <div className="options-container">
            {Object.entries(question.options).map(([key, value]) => {
              const isSelected = selectedAnswers[question.id] === key;
              const isCorrect = key === correctAnswer;
              
              return (
                <label
                  key={key}
                  className={`
                    option-label
                    ${!evaluation && isSelected ? 'option-selected' : ''}
                    ${evaluation && isCorrect ? 'option-correct' : ''}
                    ${evaluation && isSelected && isCorrect ? 'option-correct-selected' : ''}
                    ${evaluation && isSelected && !isCorrect ? 'option-incorrect' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={isSelected}
                    onChange={() => handleOptionChange(question.id, key)}
                    disabled={!!evaluation}
                  />
                  <span className="option-text">{key}: {value}</span>
                  {evaluation && isSelected && isCorrect && <span className="feedback-icon">✓</span>}
                  {evaluation && isSelected && !isCorrect && <span className="feedback-icon">✗</span>}
                </label>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="quiz-container" ref={containerRef}>
      <div className="top-controls">
        <input
          type="text"
          placeholder="Enter topic to generate quiz..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading && topic) {
              handleGenerateQuiz();
            }
          }}
        />
        <button 
          onClick={handleGenerateQuiz}
          disabled={loading || !topic}
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {quizData.length > 0 && (
        <div className="paper-content">
          {renderQuestionCards()}
          
          <button 
            className="evaluate-button"
            onClick={handleEvaluate}
            disabled={!quizId || loading}
          >
            {loading ? 'Evaluating...' : 'Evaluate Answers'}
          </button>

          {evaluation && (
            <div className="evaluation-results">
              <h3 className="results-header">
                You scored: <span className="score">{evaluation.correct}</span> out of 
                <span className="total"> {evaluation.total}</span>
              </h3>
              <p className="results-percentage">
                {Math.round((evaluation.correct / evaluation.total) * 100)}% Correct
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;