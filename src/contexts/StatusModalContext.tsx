import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface StatusModalContextProviderProps {
  children: any;
}

interface StatusModalContextProps {
  openStatusModal: () => void;
  isModalVisible: boolean;
}

const StatusModalContext = createContext<StatusModalContextProps>({
  openStatusModal: () => {},
  isModalVisible: false,
});

export const useStatusModal = () => useContext(StatusModalContext);

export const StatusModalContextProvider = ({ children }: StatusModalContextProviderProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openStatusModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const contextData = useMemo(
    () => ({
      openStatusModal,
      isModalVisible,
    }),
    [openStatusModal, isModalVisible],
  );

  return <StatusModalContext.Provider value={contextData}>{children}</StatusModalContext.Provider>;
};
