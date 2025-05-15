import React from 'react';
import SnackNotification from './SnackNotification';

type Props = React.PropsWithChildren<{}>;

const SnackNotificationWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <SnackNotification />
    </>
  );
};

export default SnackNotificationWrapper;