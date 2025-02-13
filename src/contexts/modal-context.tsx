import React from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = React.useCallback(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    setIsModalOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    setIsModalOpen(false);
  }, []);

  React.useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
} 