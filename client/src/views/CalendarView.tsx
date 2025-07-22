import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { it, enUS, zhCN } from 'date-fns/locale';
import { FormStatus } from '../types';
import { Dropdown } from '../components/ui/Dropdown';
import EventDetailsModal from '../components/calendar/EventDetailsModal';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';

interface CalendarViewProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  lang: 'it' | 'en' | 'zh';
}

const dateFnsLocales = {
  'it': it,
  'en': enUS,
  'zh': zhCN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Monday
  getDay,
  locales: dateFnsLocales,
});

const CalendarView: React.FC<CalendarViewProps> = ({ t, lang }) => {
  const { user } = useAuth();
  const { formSubmissions, forms, dealers, currentDealer } = useData();
  const [selectedDealer, setSelectedDealer] = useState<string>('all');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const activityTypes = useMemo(() => [
    ...new Set(formSubmissions.map(s => s.goalValue).filter(Boolean))
  ], [formSubmissions]);

  const dealerOptions = [
    { value: 'all', label: t('allDealers') },
    ...dealers.map(d => ({ value: d.id, label: d.name })),
  ];

  const activityTypeOptions = [
    { value: 'all', label: t('allActivityTypes') },
    ...activityTypes.map(type => ({ value: type!, label: t(type!) })),
  ];
  
  const events = useMemo(() => {
    let filteredSubmissions = formSubmissions;
    
    if (user?.role === 'DEALER' && currentDealer) {
      filteredSubmissions = formSubmissions.filter(s => s.dealerId === currentDealer.id);
    } else if (user?.role === 'ADMIN') {
      if (selectedDealer !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(s => s.dealerId === selectedDealer);
      }
      if (selectedActivityType !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(s => s.goalValue === selectedActivityType);
      }
    }
    
    return filteredSubmissions
      .filter(s => s.eventDate) 
      .map(submission => {
        const firstTextFieldValue = Object.values(submission.data)[0];
        return {
          title: firstTextFieldValue || 'Evento',
          start: new Date(submission.eventDate!),
          end: new Date(submission.eventDate!),
          resource: submission,
        };
    });
  }, [formSubmissions, user?.role, currentDealer, selectedDealer, selectedActivityType]);
  
  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = '#3b82f6'; // Default blue
    
    switch (status) {
      case FormStatus.COMPLETED:
        backgroundColor = '#22c55e'; // green-500
        break;
      case FormStatus.PENDING:
        backgroundColor = '#f59e0b'; // amber-500
        break;
      case FormStatus.ARCHIVED:
        backgroundColor = '#6b7280'; // gray-500
        break;
    }
    
    return {
      style: {
        backgroundColor,
        borderColor: backgroundColor,
      }
    };
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };
  
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      {user?.role === 'ADMIN' && (
        <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dealer')}</label>
            <Dropdown
              options={dealerOptions}
              selectedValue={selectedDealer}
              onSelect={(value) => setSelectedDealer(value as string)}
            />
          </div>
          <div className="flex-1">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('activityType')}</label>
            <Dropdown
              options={activityTypeOptions}
              selectedValue={selectedActivityType}
              onSelect={(value) => setSelectedActivityType(value as string)}
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 min-h-0">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          popup
          culture={lang}
        />
      </div>

      <EventDetailsModal 
        isOpen={!!selectedEvent}
        onClose={handleCloseModal}
        submission={selectedEvent}
        template={forms.find(t => t.id === selectedEvent?.formId)}
        t={t}
      />
    </div>
  );
};

export default CalendarView;