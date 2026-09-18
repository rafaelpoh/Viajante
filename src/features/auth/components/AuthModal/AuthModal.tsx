import { FC, useState, FormEvent } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import type { AuthModalTab } from '../../../../types/auth';
import styles from './AuthModal.module.css';

export interface AuthModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialTab?: AuthModalTab;
  readonly onLogin: (email: string, pass: string) => Promise<void>;
  readonly onRegister: (email: string, pass: string) => Promise<void>;
}

export const AuthModal: FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onLogin,
  onRegister,
}) => {
  const [currentTab, setCurrentTab] = useState<AuthModalTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = (): void => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleTabChange = (tab: AuthModalTab): void => {
    setCurrentTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (currentTab === 'register') {
      if (password.length < 6) {
        setErrorMessage('A senha precisa ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas digitadas não coincidem.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (currentTab === 'login') {
        await onLogin(email.trim(), password);
        setSuccessMessage('Login efetuado com sucesso!');
      } else {
        await onRegister(email.trim(), password);
        setSuccessMessage('Conta criada e autenticada com sucesso!');
      }

      setTimeout(() => {
        resetForm();
        onClose();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na autenticação.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={currentTab === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
    >
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'login'}
          className={`${styles.tabButton} ${currentTab === 'login' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('login')}
        >
          Entrar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'register'}
          className={`${styles.tabButton} ${currentTab === 'register' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('register')}
        >
          Cadastrar-se
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Senha"
          type="password"
          required
          placeholder={currentTab === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {currentTab === 'register' && (
          <Input
            label="Confirmar Senha"
            type="password"
            required
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {errorMessage && (
          <div role="alert" className={`${styles.feedbackMessage} ${styles.feedbackError}`}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div role="status" className={`${styles.feedbackMessage} ${styles.feedbackSuccess}`}>
            {successMessage}
          </div>
        )}

        <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
          {currentTab === 'login' ? 'Entrar' : 'Criar Conta'}
        </Button>
      </form>
    </Modal>
  );
};
