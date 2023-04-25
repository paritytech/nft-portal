import { ReactElement, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { StatusEntry } from '@helpers/interfaces';

interface ModalStatusContextProviderProps {
  children: ReactElement;
}

interface ModalStatusContextProps {
  openModalStatus: () => void;
  isModalVisible: boolean;
  status: StatusEntry | null;
  setStatus: (value: StatusEntry | null) => void;
  resetModalStatus: () => void;
  concludeModalStatus: () => void;
  setAction: (value?: (() => void)) => void;
}

/* eslint-disable @typescript-eslint/no-empty-function */
const ModalStatusContext = createContext<ModalStatusContextProps>({
  openModalStatus: () => {},
  isModalVisible: false,
  status: null,
  setStatus: () => {},
  resetModalStatus: () => {},
  concludeModalStatus: () => {},
  setAction: () => {},
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const useModalStatus = () => useContext(ModalStatusContext);

export const ModalStatusContextProvider = ({ children }: ModalStatusContextProviderProps) => {
  const [status, setStatus] = useState<StatusEntry | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState<() => void>();

  const resetModalStatus = useCallback(() => {
    setStatus(null);
    setIsModalVisible(false);
    setAction(undefined);
  }, []);

  const openModalStatus = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const concludeModalStatus = useCallback(() => {
    if (typeof action === 'function') {
      action();
    }

    resetModalStatus();
  }, [action, resetModalStatus]);

  const contextData = useMemo(
    () => ({
      openModalStatus,
      isModalVisible,
      status,
      setStatus,
      resetModalStatus,
      concludeModalStatus,
      setAction,
    }),
    [openModalStatus, isModalVisible, status, setStatus, resetModalStatus, concludeModalStatus, setAction],
  );

  return <ModalStatusContext.Provider value={contextData}>{children}</ModalStatusContext.Provider>;
};
