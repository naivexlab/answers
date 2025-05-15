import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type Notification = {
  message: string;
  severity?: AlertColor;
};

type Listener = (notification: Notification) => void;

class SnackNotificationManager {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify(message: string, severity: AlertColor = 'error') {
    this.listeners.forEach(listener => listener({ message, severity }));
  }
}

export const errorManager = new SnackNotificationManager();

const SnackNotification: React.FC = () => {
  const [notification, setNotification] = React.useState<Notification | null>(null);

  React.useEffect(() => {
    const unsubscribe = errorManager.subscribe((notification: Notification) => {
      setNotification(notification);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={notification?.severity || 'error'} 
        sx={{ width: '100%' }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackNotification;