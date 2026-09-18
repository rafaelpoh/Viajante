import { FC, useState, useCallback } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import { useCreatePlan } from './features/plan-creator/hooks/useCreatePlan';
import { useSavedPlans } from './features/saved-plans/hooks/useSavedPlans';
import { useGeolocation } from './features/map-view/hooks/useGeolocation';
import { Button } from './components/Button/Button';
import { AuthModal } from './features/auth/components/AuthModal/AuthModal';
import { PlanForm } from './features/plan-creator/components/PlanForm/PlanForm';
import { ItineraryView } from './features/itinerary/components/ItineraryView/ItineraryView';
import { SavedPlansModal } from './features/saved-plans/components/SavedPlansModal/SavedPlansModal';
import { MapModal } from './features/map-view/components/MapModal/MapModal';
import {
  PlaneIcon,
  SparklesIcon,
  HistoryIcon,
  MapPinIcon,
  WeatherIcon,
  DollarIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
} from './components/Icons/Icons';
import type { TravelPlan, TravelPlanInput } from './types/travelPlan';
import type { AuthModalTab } from './types/auth';
import styles from './App.module.css';

export const App: FC = () => {
  const { user, login, register, logout, getIdToken } = useAuth();
  const { isGenerating, error: createError, generatePlan } = useCreatePlan();
  const { plans: savedPlans, isLoading: isSavedLoading, error: savedError, fetchPlans } = useSavedPlans();
  const {
    coords: geoCoords,
    poiList: geoPois,
    message: geoMessage,
    status: geoStatus,
    requestUserLocation,
    setCustomLocation,
  } = useGeolocation();

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthModalTab>('login');
  const [isSavedPlansOpen, setIsSavedPlansOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapTitle, setMapTitle] = useState('Localização & Atrações');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active Travel Plan state
  const [currentPlan, setCurrentPlan] = useState<TravelPlan | null>(null);

  const handleOpenAuth = useCallback((tab: AuthModalTab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
    setIsMobileMenuOpen(false);
  }, []);

  const handleOpenSavedPlans = useCallback(async () => {
    setIsMobileMenuOpen(false);
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setIsSavedPlansOpen(true);
    const token = await getIdToken();
    if (token) {
      await fetchPlans(token);
    }
  }, [user, handleOpenAuth, getIdToken, fetchPlans]);

  const handleOpenUserLocationMap = useCallback(() => {
    setIsMobileMenuOpen(false);
    setMapTitle('Sua Localização Atual & Pontos Turísticos');
    setIsMapOpen(true);
    requestUserLocation();
  }, [requestUserLocation]);

  const handleOpenDestinationMap = useCallback(
    (lat: number, lon: number, destination: string) => {
      setMapTitle(`Mapa de Destino: ${destination}`);
      setCustomLocation({ lat, lon, label: destination });
      setIsMapOpen(true);
    },
    [setCustomLocation]
  );

  const handleSubmitPlan = useCallback(
    async (formData: TravelPlanInput) => {
      const token = await getIdToken();
      if (!token) {
        handleOpenAuth('login');
        return;
      }

      const plan = await generatePlan(formData, token);
      setCurrentPlan(plan);

      // Rola a visualização até o itinerário
      setTimeout(() => {
        const el = document.getElementById('itinerary-result');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    },
    [getIdToken, handleOpenAuth, generatePlan]
  );

  const handleSelectSavedPlan = useCallback((plan: TravelPlan) => {
    setCurrentPlan(plan);
    setTimeout(() => {
      const el = document.getElementById('itinerary-result');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }, []);

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContainer}`}>
          {/* Logo */}
          <a href="#home" className={styles.logo} aria-label="Viajante — Ir para a Home">
            <PlaneIcon className={styles.logoIcon} />
            <span>Viajante</span>
          </a>

          {/* Desktop Navigation */}
          <nav className={styles.navDesktop} aria-label="Navegação Principal">
            <a href="#home" className={styles.navLink}>
              Início
            </a>
            <a href="#features" className={styles.navLink}>
              Recursos
            </a>
            <a href="#create-plan" className={styles.navLink}>
              Criar Plano
            </a>
            <button
              type="button"
              className={styles.navLink}
              onClick={handleOpenSavedPlans}
            >
              <HistoryIcon style={{ width: '1.1rem', height: '1.1rem' }} />
              <span>Meus Planos</span>
            </button>
            <button
              type="button"
              className={styles.navLink}
              onClick={handleOpenUserLocationMap}
            >
              <MapPinIcon style={{ width: '1.1rem', height: '1.1rem' }} />
              <span>Localização</span>
            </button>

            {/* Auth Area */}
            <div className={styles.authGroup}>
              {user ? (
                <>
                  <div className={styles.userBadge}>
                    <UserIcon style={{ width: '1rem', height: '1rem' }} />
                    <span>{user.email?.split('@')[0]}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={<LogOutIcon style={{ width: '1rem', height: '1rem' }} />}
                    onClick={logout}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenAuth('login')}
                  >
                    Entrar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenAuth('register')}
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Alternar Menu Mobile"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <CloseIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            ) : (
              <MenuIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className={styles.mobileDrawer} role="dialog" aria-label="Menu Mobile">
            <a
              href="#home"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </a>
            <a
              href="#features"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recursos
            </a>
            <a
              href="#create-plan"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Criar Plano
            </a>
            <button
              type="button"
              className={styles.navLink}
              onClick={handleOpenSavedPlans}
            >
              <HistoryIcon style={{ width: '1.1rem', height: '1.1rem' }} />
              <span>Meus Planos</span>
            </button>
            <button
              type="button"
              className={styles.navLink}
              onClick={handleOpenUserLocationMap}
            >
              <MapPinIcon style={{ width: '1.1rem', height: '1.1rem' }} />
              <span>Localização</span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {user ? (
                <>
                  <div className={styles.userBadge}>
                    <UserIcon style={{ width: '1rem', height: '1rem' }} />
                    <span>{user.email?.split('@')[0]}</span>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={logout}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenAuth('login')}
                  >
                    Entrar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenAuth('register')}
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Seu Planejador de Viagens Definitivo
                </h1>
                <p className={styles.heroDescription}>
                  Transforme a maneira como você explora o mundo com itinerários inteligentes gerados por inteligência artificial. Obtenha clima em tempo real, dicas de vestuário, câmbio e mapas interativos.
                </p>
                <div className={styles.heroActions}>
                  <a href="#create-plan">
                    <Button variant="primary" size="lg" icon={<SparklesIcon />}>
                      Comece Sua Aventura Agora
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<MapPinIcon />}
                    onClick={handleOpenUserLocationMap}
                  >
                    Ver Atrações Próximas
                  </Button>
                </div>
              </div>

              <div className={styles.heroImageWrapper}>
                <img
                  src="/assets/hero_travel.png"
                  alt="Exploradores em uma viagem inesquecível"
                  className={styles.heroImage}
                  width="540"
                  height="440"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.featuresSection} aria-label="Recursos da Plataforma">
          <div className="container">
            <h2 className={styles.featuresHeading}>Recursos Que Você Vai Amar</h2>
            <div className={styles.featuresGrid}>
              {/* Feature 1 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <SparklesIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className={styles.featureCardTitle}>Criação de Planos com IA</h3>
                <p className={styles.featureCardDesc}>
                  Utilize o Google Gemini para gerar itinerários dia a dia personalizados de acordo com suas preferências e perfil de viagem.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <HistoryIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className={styles.featureCardTitle}>Histórico de Viagens Salvas</h3>
                <p className={styles.featureCardDesc}>
                  Acesse todos os seus roteiros salvos no Firestore a qualquer instante, vinculados com total segurança à sua conta.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <MapPinIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className={styles.featureCardTitle}>Geolocalização Integrada</h3>
                <p className={styles.featureCardDesc}>
                  Descubra restaurantes e pontos de interesse próximos da sua posição ou visualize o destino do roteiro via Leaflet.
                </p>
              </div>

              {/* Feature 4 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <WeatherIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className={styles.featureCardTitle}>Previsão do Tempo Detalhada</h3>
                <p className={styles.featureCardDesc}>
                  Prepare a mala com dados reais de temperatura e recomendações adequadas de roupas da OpenWeather API.
                </p>
              </div>

              {/* Feature 5 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <DollarIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className={styles.featureCardTitle}>Planejamento Financeiro & Moeda</h3>
                <p className={styles.featureCardDesc}>
                  Saiba qual moeda levar, a cotação estimada e uma projeção de orçamento diário recomendada para cada destino.
                </p>
              </div>

              {/* Feature 6 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrapper}>
                  <PlaneIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className={styles.featureCardTitle}>Segurança e Privacidade</h3>
                <p className={styles.featureCardDesc}>
                  Seus dados e planos são protegidos com autenticação robusta via Firebase Auth e regras de segurança por usuário.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Create Plan Section */}
        <PlanForm
          isAuthenticated={Boolean(user)}
          isGenerating={isGenerating}
          errorMessage={createError}
          onRequireAuth={() => handleOpenAuth('login')}
          onSubmitPlan={handleSubmitPlan}
        />

        {/* Itinerary View Section */}
        {currentPlan && (
          <ItineraryView
            plan={currentPlan}
            onOpenMap={handleOpenDestinationMap}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Viajante. Feito com paixão para exploradores do mundo.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        onLogin={login}
        onRegister={register}
      />

      {/* Saved Plans History Modal */}
      <SavedPlansModal
        isOpen={isSavedPlansOpen}
        onClose={() => setIsSavedPlansOpen(false)}
        plans={savedPlans}
        isLoading={isSavedLoading}
        error={savedError}
        onSelectPlan={handleSelectSavedPlan}
      />

      {/* Map View Modal */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        title={mapTitle}
        coordinates={geoCoords}
        pointsOfInterest={geoPois}
        message={geoMessage}
        status={geoStatus}
      />
    </>
  );
};
