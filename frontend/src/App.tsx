import './css/App.css';
import SnackNotificationWrapper from './components/SnackNotificationWrapper';
import QuizComponent from './components/QuizComponent';

function App() {
  return (
    <SnackNotificationWrapper>
      <QuizComponent />
    </SnackNotificationWrapper>
  );
}

export default App;
