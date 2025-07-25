import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import {
  User, Dealer, Goal, Notice, Form, FormSubmission, Product, SalesForecast,
  DashboardWidget, Layout, Contact, FormField, Attendee, FormStatus, WidgetConfig
} from '../types';

interface DataContextType {
  loading: boolean;
  users: User[];
  dealers: Dealer[];
  goals: Goal[];
  notices: Notice[];
  forms: Form[];
  formSubmissions: FormSubmission[];
  products: Product[];
  salesForecasts: SalesForecast[];
  dashboardWidgets: DashboardWidget[];
  dashboardLayout: Layout[];
  currentDealer: Dealer | null;
  readNoticeIds: Set<string>;
  unreadNoticesCount: number;
  // User Management
  createUser: (data: Omit<User, 'id' | 'dealer'>) => Promise<void>;
  updateUser: (userId: string, data: Partial<Omit<User, 'id' | 'dealer'>>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  resetUserPassword: (userId: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{success: boolean, message: string}>;
  // Dashboard Management
  updateDashboardLayout: (newLayout: Layout[]) => void;
  addWidget: (widget: DashboardWidget, layout: Layout) => void;
  updateWidget: (widgetId: string, updatedConfig: WidgetConfig) => void;
  removeWidget: (widgetId: string) => void;
  // Dealer Management
  addDealer: (dealerData: Omit<Dealer, 'id' | 'contacts'>) => void;
  updateDealer: (dealerId: string, updatedData: Partial<Omit<Dealer, 'id'>>) => void;
  deleteDealer: (dealerId: string) => void;
  // Contact Management
  addContact: (dealerId: string, contactData: Omit<Contact, 'id' | 'dealerId'>) => void;
  updateContact: (dealerId: string, contactId: string, updatedData: Partial<Omit<Contact, 'id'>>) => void;
  deleteContact: (dealerId: string, contactId: string) => void;
  // Form Management
  addFormTemplate: (templateData: Omit<Form, 'id' | 'fields' | 'published' | 'dealerCanEditSubmissions' | 'archived'>) => void;
  updateFormTemplate: (templateId: string, updatedData: Partial<Omit<Form, 'id' | 'fields'>>) => void;
  updateTemplateFields: (templateId: string, fields: FormField[]) => void;
  archiveFormTemplate: (templateId: string) => void;
  cloneFormTemplate: (templateId: string, t: (key: string) => string) => void;
  deleteTemplatePermanently: (templateId: string) => void;
  // Submission Management
  addFormSubmission: (submissionData: Omit<FormSubmission, 'id' | 'submissionDate' | 'dealerName' | 'status' | 'goalValue' | 'eventDate' | 'userId'>) => void;
  updateFormSubmission: (submissionId: string, updatedData: Partial<Omit<FormSubmission, 'id' | 'formId' | 'dealerId' | 'dealerName' | 'submissionDate'>>) => void;
  // Goal Management
  addGoal: (goalData: Omit<Goal, 'id' | 'progress'>) => void;
  updateGoal: (goalId: string, updatedData: Partial<Omit<Goal, 'id'>>) => void;
  deleteGoal: (goalId: string) => void;
  // Notice Management
  addNotice: (noticeData: Omit<Notice, 'id' | 'creationDate' | 'participations'>) => void;
  deleteNotice: (noticeId: string) => void;
  handleWebinarConfirmation: (noticeId: string, dealerId: string, confirm: boolean) => void;
  handleUpdateAttendees: (noticeId: string, dealerId: string, attendees: Attendee[]) => void;
  markNoticesAsRead: (noticeIds: string[]) => void;
  // Forecast Management
  addSalesForecast: (data: Omit<SalesForecast, 'id' | 'dealerName' | 'productName' | 'actualUnits' | 'status'>) => void;
  updateSalesForecast: (forecastId: string, data: Partial<Omit<SalesForecast, 'id'>>) => void;
  deleteSalesForecast: (forecastId: string) => void;
  updateActualUnits: (forecastId: string, actualUnits: number) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesForecasts, setSalesForecasts] = useState<SalesForecast[]>([]);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [dashboardLayout, setDashboardLayout] = useState<Layout[]>([]);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  
  const currentDealer = user?.dealerId ? dealers.find(d => d.id === user.dealerId) || null : null;
  const unreadNoticesCount = user?.role === 'DEALER' ? notices.filter(n => !readNoticeIds.has(n.id)).length : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get('/data/dashboard');
        const data = response.data;
        
        const fetchedDealers = data.dealers || [];
        const fetchedUsers = (data.users || []).map((u: User) => ({
            ...u,
            dealer: u.dealerId ? fetchedDealers.find((d: Dealer) => d.id === u.dealerId) : null,
        }));
        
        setUsers(fetchedUsers);
        setDealers(fetchedDealers);
        setGoals(data.goals || []);
        setNotices(data.notices || []);
        setForms(data.forms || []);
        setFormSubmissions(data.submissions || []);
        setProducts(data.products || []);
        setSalesForecasts(data.salesForecasts || []);
        setDashboardWidgets(data.dashboardWidgets || []);
        setDashboardLayout(data.dashboardLayout || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  
  // --- UTILITY ---
  const getGoalAndEventValues = (template: Form, data: Record<string, any>) => {
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

  // --- HANDLERS (with API calls) ---
  const createUser = async (data: Omit<User, 'id' | 'dealer'>) => {
    try {
      const response = await api.post('/users', data);
      setUsers(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  const updateUser = async (userId: string, data: Partial<Omit<User, 'id' | 'dealer'>>) => {
    try {
      const response = await api.put(`/users/${userId}`, data);
      setUsers(prev => prev.map(u => u.id === userId ? response.data : u));
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const resetUserPassword = async (userId: string): Promise<boolean> => {
    try {
      await api.post(`/users/${userId}/reset-password`);
      return true;
    } catch (error) {
      console.error("Failed to reset password", error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    try {
      await api.post('/users/change-password', { currentPassword, newPassword });
      return { success: true, message: 'passwordChangedSuccess' };
    } catch (error: any) {
      console.error("Failed to change password", error);
      const message = error.response?.data?.message === 'Invalid current password' 
        ? 'currentPasswordIncorrect' 
        : 'genericError';
      return { success: false, message };
    }
  };

  const updateDashboardLayout = (newLayout: Layout[]) => setDashboardLayout(newLayout);
  
  const addWidget = (widget: DashboardWidget, layout: Layout) => {
    setDashboardWidgets(prev => [...prev, widget]);
    setDashboardLayout(prev => [...prev, layout]);
  };
  
  const updateWidget = (widgetId: string, updatedConfig: WidgetConfig) => {
    setDashboardWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, config: updatedConfig } : w));
  };

  const removeWidget = (widgetId: string) => {
    setDashboardWidgets(prev => prev.filter(w => w.id !== widgetId));
    setDashboardLayout(prev => prev.filter(l => l.i !== widgetId));
  };
  
  const addDealer = (dealerData: Omit<Dealer, 'id' | 'contacts'>) => {
    const newDealer: Dealer = { id: `dealer-${Date.now()}`, ...dealerData, contacts: [] };
    setDealers(prev => [...prev, newDealer]);
    // api.post('/dealers', newDealer);
  };

  const updateDealer = (dealerId: string, updatedData: Partial<Omit<Dealer, 'id'>>) => {
    setDealers(prev => prev.map(d => (d.id === dealerId ? { ...d, ...updatedData } : d)));
    // api.patch(`/dealers/${dealerId}`, updatedData);
  };

  const deleteDealer = (dealerId: string) => {
    setDealers(prev => prev.filter(d => d.id !== dealerId));
    // api.delete(`/dealers/${dealerId}`);
  };
  
  const addContact = (dealerId: string, contactData: Omit<Contact, 'id' | 'dealerId'>) => {
    setDealers(prev => prev.map(dealer => {
        if (dealer.id === dealerId) {
            const newContact: Contact = { id: `contact-${Date.now()}`, ...contactData, dealerId };
            return { ...dealer, contacts: [...dealer.contacts, newContact] };
        }
        return dealer;
    }));
  };

  const updateContact = (dealerId: string, contactId: string, updatedData: Partial<Omit<Contact, 'id'>>) => {
      setDealers(prev => prev.map(dealer => {
          if (dealer.id === dealerId) {
              return { ...dealer, contacts: dealer.contacts.map(c => c.id === contactId ? { ...c, ...updatedData } : c) };
          }
          return dealer;
      }));
  };

  const deleteContact = (dealerId: string, contactId: string) => {
      setDealers(prev => prev.map(dealer => {
          if (dealer.id === dealerId) {
              return { ...dealer, contacts: dealer.contacts.filter(c => c.id !== contactId) };
          }
          return dealer;
      }));
  };

  const addFormTemplate = (templateData: Omit<Form, 'id' | 'fields' | 'published' | 'dealerCanEditSubmissions' | 'archived'>) => {
      const newTemplate: Form = {
          id: `template-${Date.now()}`,
          ...templateData,
          fields: [],
          published: false,
          dealerCanEditSubmissions: true,
          archived: false,
      };
      setForms(prev => [newTemplate, ...prev]);
  };

  const updateFormTemplate = (templateId: string, updatedData: Partial<Omit<Form, 'id' | 'fields'>>) => {
      setForms(prev => prev.map(t => t.id === templateId ? {...t, ...updatedData} : t));
  };
  
  const updateTemplateFields = (templateId: string, fields: FormField[]) => {
      setForms(prev => prev.map(t => t.id === templateId ? {...t, fields} : t));
  }
  
  const archiveFormTemplate = (templateId: string) => {
    setForms(prev => prev.map(t => t.id === templateId ? { ...t, archived: true } : t));
    setFormSubmissions(prev => prev.map(s => s.formId === templateId ? {...s, status: FormStatus.ARCHIVED} : s));
  };

  const cloneFormTemplate = (templateId: string, t: (key: string) => string) => {
    const templateToClone = forms.find(t => t.id === templateId);
    if (!templateToClone) return;
    const newTemplate: Form = {
      ...templateToClone,
      id: `template-${Date.now()}`,
      title: `${t('clone')} ${templateToClone.title}`,
      published: false,
      archived: false,
    };
    setForms(prev => [newTemplate, ...prev]);
  };

  const deleteTemplatePermanently = (templateId: string) => {
    setForms(prev => prev.filter(t => t.id !== templateId));
    setFormSubmissions(prev => prev.filter(s => s.formId !== templateId));
  };
  
  const addFormSubmission = useCallback((submissionData: Omit<FormSubmission, 'id' | 'submissionDate' | 'dealerName' | 'status' | 'goalValue' | 'eventDate' | 'userId'>) => {
      const template = forms.find(t => t.id === submissionData.formId);
      if (!template || !user) return;
      
      const dealerName = dealers.find(d => d.id === submissionData.dealerId)?.name || 'Unknown Dealer';
      const { goalValue, eventDate } = getGoalAndEventValues(template, submissionData.data);

      const newSubmission: FormSubmission = {
          id: `sub-${Date.now()}`,
          ...submissionData,
          userId: user.id,
          dealerName,
          submissionDate: new Date().toISOString(),
          status: FormStatus.PENDING,
          goalValue,
          eventDate,
      };
      setFormSubmissions(prev => [newSubmission, ...prev]);
  }, [user, forms, dealers]);

  const updateFormSubmission = (submissionId: string, updatedData: Partial<Omit<FormSubmission, 'id' | 'formId' | 'dealerId' | 'dealerName' | 'submissionDate'>>) => {
    setFormSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        const updatedSubmission = { ...s, ...updatedData };
        const template = forms.find(t => t.id === s.formId);
        if (template && updatedData.data) {
            const { goalValue, eventDate } = getGoalAndEventValues(template, updatedData.data);
            updatedSubmission.goalValue = goalValue;
            updatedSubmission.eventDate = eventDate;
        }
        return updatedSubmission;
      }
      return s;
    }));
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'progress'>) => {
    const newGoal: Goal = { id: `goal-${Date.now()}`, ...goalData, progress: 0 };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (goalId: string, updatedData: Partial<Omit<Goal, 'id'>>) => {
    setGoals(prev => prev.map(g => (g.id === goalId ? { ...g, ...updatedData } : g)));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };
  
  const addNotice = (noticeData: Omit<Notice, 'id' | 'creationDate' | 'participations'>) => {
    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      ...noticeData,
      creationDate: new Date().toISOString(),
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

                  if (attendees.length === 0) {
                      newParticipations = newParticipations.filter(p => p.dealerId !== dealerId);
                  } else if (participationIndex > -1) {
                      newParticipations[participationIndex] = { ...newParticipations[participationIndex], attendees: attendees };
                  } else {
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


  const value: DataContextType = {
    loading, users, dealers, goals, notices, forms, formSubmissions, products, salesForecasts,
    dashboardWidgets, dashboardLayout, currentDealer, readNoticeIds, unreadNoticesCount,
    createUser, updateUser, deleteUser, resetUserPassword, changePassword,
    updateDashboardLayout, addWidget, updateWidget, removeWidget,
    addDealer, updateDealer, deleteDealer, addContact, updateContact, deleteContact,
    addFormTemplate, updateFormTemplate, updateTemplateFields, archiveFormTemplate,
    cloneFormTemplate, deleteTemplatePermanently, addFormSubmission, updateFormSubmission,
    addGoal, updateGoal, deleteGoal, addNotice, deleteNotice, handleWebinarConfirmation,
    handleUpdateAttendees, markNoticesAsRead, addSalesForecast, updateSalesForecast,
    deleteSalesForecast, updateActualUnits
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};