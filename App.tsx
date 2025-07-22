
import React, { useState, useEffect } from 'react';
import { UserRole, AppView, Dealer, Goal, Notice, Contact, FormTemplate, FormSubmission, FormStatus, FormField, DashboardWidget, Layout, Attendee, NoticeType, Product, SalesForecast } from './types';
import { useTheme } from './hooks/useTheme';
import { useTranslation } from './hooks/useTranslation';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AddressBookView from './views/AddressBookView';
import CalendarView from './views/CalendarView';
import Dashboard from './views/Dashboard';
import DealersView from './views/DealersView';
import FormsView from './views/FormsView';
import GoalsView from './views/GoalsView';
import MyTeamView from './views/MyTeamView';
import NoticesView from './views/NoticesView';
import PlaceholderView from './views/PlaceholderView';
import AvailableFormsView from './views/AvailableFormsView';
import MySubmissionsView from './views/MySubmissionsView';
import SalesForecastView from './views/SalesForecastView';
import SettingsView from './views/SettingsView';
import { getDealers, getGoals, getNotices, getFormTemplates, getFormSubmissions, getDashboardWidgets, getDashboardLayout, getProducts, getSalesForecasts } from './services/db';
import { Icon } from './components/ui/Icon';

export default function App(): React.ReactNode {
  const [theme, toggleTheme] = useTheme();
  const { lang, setLang, t } = useTranslation();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesForecasts, setSalesForecasts] = useState<SalesForecast[]>([]);


  // New state for customizable dashboard
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [dashboardLayout, setDashboardLayout] = useState<Layout[]>([]);
  
  const currentDealer = dealers.find(d => d.id === '2') || (dealers.length > 0 ? dealers[0] : null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dealersData, goalsData, noticesData, templatesData, submissionsData, widgetsData, layoutData, productsData, forecastsData] = await Promise.all([
          getDealers(),
          getGoals(),
          getNotices(),
          getFormTemplates(),
          getFormSubmissions(),
          getDashboardWidgets(userRole),
          getDashboardLayout(userRole),
          getProducts(),
          getSalesForecasts()
        ]);
        setDealers(dealersData);
        setGoals(goalsData);
        setNotices(noticesData.sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()));
        setFormTemplates(templatesData);
        setFormSubmissions(submissionsData.sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
        setDashboardWidgets(widgetsData);
        setDashboardLayout(layoutData);
        setProducts(productsData);
        setSalesForecasts(forecastsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userRole]);
  
  const unreadNoticesCount = userRole === UserRole.DEALER ? notices.filter(n => !readNoticeIds.has(n.id)).length : 0;

  // --- DASHBOARD HANDLERS ---
  const updateDashboardLayout = (newLayout: Layout[]) => {
    setDashboardLayout(newLayout);
  };
  
  const addWidget = (widget: DashboardWidget, layout: Layout) => {
    setDashboardWidgets(prev => [...prev, widget]);
    setDashboardLayout(prev => [...prev, layout]);
  };
  
  const updateWidget = (widgetId: string, updatedConfig: any) => {
    setDashboardWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, config: updatedConfig } : w));
  };

  const removeWidget = (widgetId: string) => {
    setDashboardWidgets(prev => prev.filter(w => w.id !== widgetId));
    setDashboardLayout(prev => prev.filter(l => l.i !== widgetId));
  };


  // --- ENTITY HANDLERS ---
  const addDealer = (dealerData: Omit<Dealer, 'id' | 'contacts'>) => {
    const newDealer: Dealer = {
      id: `dealer-${new Date().getTime()}`,
      ...dealerData,
      contacts: [],
    };
    setDealers(prev => [...prev, newDealer]);
  };

  const updateDealer = (dealerId: string, updatedData: Partial<Omit<Dealer, 'id'>>) => {
    setDealers(prev =>
      prev.map(d => (d.id === dealerId ? { ...d, ...updatedData } : d))
    );
  };

  const deleteDealer = (dealerId: string) => {
    setDealers(prev => prev.filter(d => d.id !== dealerId));
    setFormSubmissions(prev => prev.filter(s => s.dealerId !== dealerId));
    setSalesForecasts(prev => prev.filter(f => f.dealerId !== dealerId));
  };
  
  const addContact = (dealerId: string, contactData: Omit<Contact, 'id'>) => {
    setDealers(prev => prev.map(dealer => {
        if (dealer.id === dealerId) {
            const newContact: Contact = {
                id: `contact-${dealerId}-${new Date().getTime()}`,
                ...contactData,
            };
            return { ...dealer, contacts: [...dealer.contacts, newContact] };
        }
        return dealer;
    }));
  };

  const updateContact = (dealerId: string, contactId: string, updatedData: Partial<Omit<Contact, 'id'>>) => {
      setDealers(prev => prev.map(dealer => {
          if (dealer.id === dealerId) {
              const updatedContacts = dealer.contacts.map(c => 
                  c.id === contactId ? { ...c, ...updatedData } : c
              );
              return { ...dealer, contacts: updatedContacts };
          }
          return dealer;
      }));
  };

  const deleteContact = (dealerId: string, contactId: string) => {
      setDealers(prev => prev.map(dealer => {
          if (dealer.id === dealerId) {
              const updatedContacts = dealer.contacts.filter(c => c.id !== contactId);
              return { ...dealer, contacts: updatedContacts };
          }
          return dealer;
      }));
  };

  const addFormTemplate = (templateData: Omit<FormTemplate, 'id' | 'fields' | 'published' | 'dealerCanEditSubmissions' | 'archived'>) => {
      const newTemplate: FormTemplate = {
          id: `template-${new Date().getTime()}`,
          ...templateData,
          fields: [],
          published: false,
          dealerCanEditSubmissions: true,
          archived: false,
      };
      setFormTemplates(prev => [newTemplate, ...prev]);
  };

  const updateFormTemplate = (templateId: string, updatedData: Partial<Omit<FormTemplate, 'id' | 'fields'>>) => {
      setFormTemplates(prev => prev.map(t => t.id === templateId ? {...t, ...updatedData} : t));
  };
  
  const updateTemplateFields = (templateId: string, fields: FormField[]) => {
      setFormTemplates(prev => prev.map(t => t.id === templateId ? {...t, fields} : t));
  }
  
  const archiveFormTemplate = (templateId: string) => {
    setFormTemplates(prev => prev.map(t => t.id === templateId ? { ...t, archived: true } : t));
    // Also archive submissions
    setFormSubmissions(prev => prev.map(s => s.templateId === templateId ? {...s, status: FormStatus.ARCHIVED} : s));
    // Remove dashboard widgets that depend on this template
    setDashboardWidgets(prev => prev.filter(w => w.config.formTemplateId !== templateId));
  };

  const cloneFormTemplate = (templateId: string) => {
    const templateToClone = formTemplates.find(t => t.id === templateId);
    if (!templateToClone) return;

    const newTemplate: FormTemplate = {
      ...templateToClone,
      id: `template-${new Date().getTime()}`,
      title: `${t('clone')} ${templateToClone.title}`,
      published: false,
      archived: false,
    };
    setFormTemplates(prev => [newTemplate, ...prev]);
  };

  const deleteTemplatePermanently = (templateId: string) => {
    setFormTemplates(prev => prev.filter(t => t.id !== templateId));
    setFormSubmissions(prev => prev.filter(s => s.templateId !== templateId));
  };


  const getGoalAndEventValues = (template: FormTemplate, data: Record<string, any>) => {
      let goalValue;
      let eventDate;
      for (const field of template.fields) {
        if (field.isGoalLink && field.options) {
          const submittedOptionValue = data[field.id];
          const matchedOption = field.options.find(opt => opt.value === submittedOptionValue);
          if (matchedOption?.goalCategory) {
            goalValue = matchedOption.goalCategory;
          }
        }
        if (field.isEventDate) {
          eventDate = data[field.id];
        }
      }
      return { goalValue, eventDate };
  }

  const addFormSubmission = (submissionData: Omit<FormSubmission, 'id' | 'submissionDate' | 'dealerName' | 'status' | 'goalValue' | 'eventDate'>) => {
      const template = formTemplates.find(t => t.id === submissionData.templateId);
      if (!template) return;
      
      const dealerName = dealers.find(d => d.id === submissionData.dealerId)?.name || 'Unknown Dealer';
      
      const { goalValue, eventDate } = getGoalAndEventValues(template, submissionData.data);

      const newSubmission: FormSubmission = {
          id: `sub-${new Date().getTime()}`,
          ...submissionData,
          dealerName,
          submissionDate: new Date().toISOString().split('T')[0],
          status: FormStatus.PENDING,
          goalValue,
          eventDate,
      };
      setFormSubmissions(prev => [newSubmission, ...prev]);
  };

  const updateFormSubmission = (submissionId: string, updatedData: Partial<Omit<FormSubmission, 'id' | 'templateId' | 'dealerId' | 'dealerName' | 'submissionDate'>>) => {
    setFormSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        const updatedSubmission = { ...s, ...updatedData };
        const template = formTemplates.find(t => t.id === s.templateId);
        if (template) {
            const { goalValue, eventDate } = getGoalAndEventValues(template, updatedSubmission.data);
            updatedSubmission.goalValue = goalValue;
            updatedSubmission.eventDate = eventDate;
        }
        return updatedSubmission;
      }
      return s;
    }));
  };

  const addGoal = (goalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      id: `goal-${new Date().getTime()}`,
      ...goalData,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (goalId: string, updatedData: Partial<Omit<Goal, 'id'>>) => {
    setGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, ...updatedData } : g))
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'creationDate' | 'participations'>) => {
    const newNotice: Notice = {
      id: `notice-${new Date().getTime()}`,
      ...noticeData,
      creationDate: new Date().toISOString().split('T')[0],
      participations: [],
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const deleteNotice = (noticeId: string) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  const handleWebinarConfirmation = (noticeId: string, dealerId: string, confirm: boolean) => {
    setNotices(prevNotices =>
        prevNotices.map(notice => {
            if (notice.id === noticeId) {
                const newParticipations = confirm
                    ? [...notice.participations, { dealerId, attendees: [] }]
                    : notice.participations.filter(p => p.dealerId !== dealerId);
                return { ...notice, participations: newParticipations };
            }
            return notice;
        })
    );
  };

  const handleUpdateAttendees = (noticeId: string, dealerId: string, attendees: Attendee[]) => {
      setNotices(prevNotices =>
          prevNotices.map(notice => {
              if (notice.id === noticeId) {
                  const participationIndex = notice.participations.findIndex(p => p.dealerId === dealerId);
                  let newParticipations = [...notice.participations];

                  if (attendees.length === 0) { // Un-register
                      newParticipations = newParticipations.filter(p => p.dealerId !== dealerId);
                  } else if (participationIndex > -1) { // Update
                      newParticipations[participationIndex] = { ...newParticipations[participationIndex], attendees: attendees };
                  } else { // Add new
                      newParticipations.push({ dealerId, attendees });
                  }

                  return { ...notice, participations: newParticipations };
              }
              return notice;
          })
      );
  };

  const markNoticesAsRead = (noticeIds: string[]) => {
    setReadNoticeIds(prev => new Set([...prev, ...noticeIds]));
  };
  
    // --- Sales Forecast Handlers ---
  const addSalesForecast = (data: Omit<SalesForecast, 'id' | 'dealerName' | 'productName' | 'actualUnits' | 'status'>) => {
      const dealer = dealers.find(d => d.id === data.dealerId);
      const product = products.find(p => p.id === data.productId);
      if (!dealer || !product) return;
      
      const newForecast: SalesForecast = {
          id: `sf-${Date.now()}`,
          ...data,
          dealerName: dealer.name,
          productName: product.name,
          actualUnits: 0,
          status: 'Open'
      };
      setSalesForecasts(prev => [...prev, newForecast]);
  };

  const updateSalesForecast = (forecastId: string, data: Partial<Omit<SalesForecast, 'id'>>) => {
      setSalesForecasts(prev => prev.map(f => f.id === forecastId ? { ...f, ...data } : f));
  };

  const deleteSalesForecast = (forecastId: string) => {
      setSalesForecasts(prev => prev.filter(f => f.id !== forecastId));
  };
  
  const updateActualUnits = (forecastId: string, actualUnits: number) => {
      setSalesForecasts(prev => prev.map(f => f.id === forecastId ? { ...f, actualUnits } : f));
  };


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
                  userRole={userRole} 
                  t={t} 
                  dealers={dealers} 
                  formSubmissions={formSubmissions}
                  currentDealer={currentDealer}
                  goals={goals}
                  formTemplates={formTemplates}
                  widgets={dashboardWidgets}
                  layout={dashboardLayout}
                  onLayoutChange={updateDashboardLayout}
                  onAddWidget={addWidget}
                  onUpdateWidget={updateWidget}
                  onRemoveWidget={removeWidget}
                />;
      case 'dealers':
        return <DealersView 
                  t={t} 
                  dealers={dealers} 
                  onAddDealer={addDealer}
                  onUpdateDealer={updateDealer}
                  onDeleteDealer={deleteDealer}
                />;
      case 'forms':
        return userRole === UserRole.ADMIN ? <FormsView
                  t={t}
                  formTemplates={formTemplates}
                  formSubmissions={formSubmissions}
                  dealers={dealers}
                  onAddFormTemplate={addFormTemplate}
                  onUpdateFormTemplate={updateFormTemplate}
                  onUpdateTemplateFields={updateTemplateFields}
                  onUpdateFormSubmission={updateFormSubmission}
                  onArchiveFormTemplate={archiveFormTemplate}
                  onCloneFormTemplate={cloneFormTemplate}
                  onDeleteTemplatePermanently={deleteTemplatePermanently}
               /> : <PlaceholderView t={t} pageName="Dashboard" iconName="dashboard" />;
      case 'availableForms':
        return userRole === UserRole.DEALER ? <AvailableFormsView
                  t={t}
                  formTemplates={formTemplates.filter(ft => ft.published && !ft.archived)}
                  currentDealer={currentDealer}
                  onAddFormSubmission={addFormSubmission}
                /> : <PlaceholderView t={t} pageName="Dashboard" iconName="dashboard" />;
      case 'mySubmissions':
        return userRole === UserRole.DEALER && currentDealer ? <MySubmissionsView
                  t={t}
                  formSubmissions={formSubmissions.filter(s => s.dealerId === currentDealer.id)}
                  formTemplates={formTemplates}
                  onUpdateFormSubmission={updateFormSubmission}
                /> : <PlaceholderView t={t} pageName="Dashboard" iconName="dashboard" />;
      case 'salesForecasts':
         return <SalesForecastView
                    t={t}
                    userRole={userRole}
                    forecasts={salesForecasts}
                    dealers={dealers}
                    products={products}
                    onAdd={addSalesForecast}
                    onUpdate={updateSalesForecast}
                    onDelete={deleteSalesForecast}
                    onUpdateActuals={updateActualUnits}
                    currentDealerId={currentDealer?.id || ''}
                 />;
      case 'goals':
        return <GoalsView
                  t={t}
                  goals={goals}
                  onAddGoal={addGoal}
                  onUpdateGoal={updateGoal}
                  onDeleteGoal={deleteGoal}
               />;
       case 'addressBook':
        return <AddressBookView 
                  dealers={dealers} 
                  t={t} 
                  onAddContact={addContact}
                  onUpdateContact={updateContact}
                  onDeleteContact={deleteContact}
                />;
        case 'myTeam':
          return currentDealer ? (
              <MyTeamView
                t={t}
                currentDealer={currentDealer}
                onAddContact={(contactData) => addContact(currentDealer.id, contactData)}
                onUpdateContact={(contactId, updatedData) => updateContact(currentDealer.id, contactId, updatedData)}
                onDeleteContact={(contactId) => deleteContact(currentDealer.id, contactId)}
              />
          ) : (
             <PlaceholderView t={t} pageName={t('myTeam')} iconName="dealers" />
          );
       case 'notices':
        return <NoticesView
                  t={t}
                  userRole={userRole}
                  notices={notices}
                  dealers={dealers}
                  readNoticeIds={readNoticeIds}
                  currentDealerId={currentDealer?.id || ''}
                  onAddNotice={addNotice}
                  onDeleteNotice={deleteNotice}
                  onWebinarConfirm={handleWebinarConfirmation}
                  onUpdateAttendees={handleUpdateAttendees}
                  onMarkAsRead={markNoticesAsRead}
                />;
      case 'calendar':
        return <CalendarView
                  t={t}
                  lang={lang}
                  userRole={userRole}
                  formSubmissions={formSubmissions}
                  formTemplates={formTemplates}
                  dealers={dealers}
                  currentDealer={currentDealer}
               />;
      case 'settings':
        return <SettingsView
                  t={t}
                  lang={lang}
                  setLang={setLang}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  userRole={userRole}
                  currentDealer={currentDealer}
                  setActiveView={setActiveView}
                />;
      default:
        return <PlaceholderView t={t} pageName="Dashboard" iconName="dashboard" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        userRole={userRole} 
        t={t} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        unreadNoticesCount={unreadNoticesCount}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          lang={lang}
          setLang={setLang}
          userRole={userRole}
          setUserRole={setUserRole}
          t={t}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-50 dark:bg-gray-900 z-10">
              <Icon name="spinner" className="w-16 h-16 text-dji-blue" />
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}
