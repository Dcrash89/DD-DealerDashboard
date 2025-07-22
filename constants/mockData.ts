


import { Dealer, DealerCategory, FormStatus, Goal, Contact, Notice, NoticePriority, FormTemplate, FormFieldType, FormSubmission, DashboardWidget, WidgetType, Layout, ChartType, AggregationType, NoticeType, Attendee, Product, SalesForecast } from '../types';

const dealersData = [
    { id: '1', sap: '1210004699', name: '3D Solutions S.R.L.', category: DealerCategory.A, website: 'https://www.3dsolutions.it/eu/it/', contacts: [
        { id: 'c1-1', name: 'Mario Rossi', role: ['President CCO'], email: 'm.rossi@3dsolutions.it', phone: '3331112233' },
        { id: 'c1-2', name: 'Laura Esposito', role: ['CEO'], email: 'l.esposito@3dsolutions.it', phone: '3332223344' },
        { id: 'c1-3', name: 'Anna Bruno', role: ['Marketing'], email: 'a.bruno@3dsolutions.it' },
        { id: 'c1-4', name: 'Luca Bianchi', role: ['Marketing'], email: 'l.bianchi@3dsolutions.it' },
        { id: 'c1-5', name: 'Paolo Ferrari', role: ['Sales'], email: 'p.ferrari@3dsolutions.it' },
    ]},
    { id: '2', sap: '1210009570', name: 'AeroTech Robotics SRL', category: DealerCategory.A, website: 'https://www.aerotech.com/', contacts: [
        { id: 'c2-1', name: 'Amministrazione', role: ['Amministrazione'], email: 'admin.robotics@aerotech.com' },
        { id: 'c2-2', name: 'Simone Conti', role: ['Marketing'], email: 's.conti@aerotech.com' },
        { id: 'c2-3', name: 'Chiara Greco', role: ['Marketing'], email: 'c.greco@aerotech.com', phone: '3333334455' },
        { id: 'c2-4', name: 'Giovanni Romano', role: ['CEO'], email: 'g.romano@aerotech.com', phone: '3334445566' },
        { id: 'c2-5', name: 'Giuseppe Ricci', role: ['Purchase'], email: 'g.ricci@aerotech.com' },
    ]},
    { id: '3', sap: '1210011625', name: 'Quantum Surveying SRL', category: DealerCategory.A, website: 'https://www.quantumsurvey.it/', contacts: [
        { id: 'c3-1', name: 'Marco Giordano', role: ['CEO'], email: 'm.giordano@quantumsurvey.it' },
    ]},
    { id: '4', sap: '1210008665', name: 'Drone Vision SRL', category: DealerCategory.A, website: 'https://www.drone-vision.it', contacts: [
        { id: 'c4-1', name: 'Amministrazione', role: ['Amministrazione'], email: 'info@dronevision.net' },
        { id: 'c4-2', name: 'Andrea Costa', role: ['COCEO'], email: 'a.costa@dronevision.net', phone: '3335556677' },
        { id: 'c4-3', name: 'Francesca Gallo', role: ['COCEO'], email: 'f.gallo@dronevision.net' },
    ]},
    { id: '5', sap: '1210011009', name: 'Digital Wings SRL', category: DealerCategory.A, website: 'https://digitalwings.it/it/', contacts: [
        { id: 'c5-1', name: 'Roberto Mancini', role: ['CEO'], email: 'r.mancini@digitalwings.com', phone: '3336667788' },
    ]},
    { id: '6', sap: '1210010384', name: 'Orion Dynamics S.R.L.', category: DealerCategory.A, website: 'https://www.oriondynamics.com/', contacts: [
        { id: 'c6-1', name: 'Davide Rizzo', role: ['Tecnico', 'Marketing'], email: 'd.rizzo@oriondynamics.com', phone: '3337778899' },
        { id: 'c6-2', name: 'Stefano Moretti', role: ['CEO'], email: 's.moretti@oriondynamics.com', phone: '3338889900' },
    ]},
    { id: '7', sap: '1210010042', name: 'Cube Systems SRL', category: DealerCategory.A, website: 'https://www.cubesys.it/', contacts: [
        { id: 'c7-1', name: 'Antonio Verdi', role: ['CEO', 'Marketing'], email: 'a.verdi@cubesys.it', phone: '3339990011' },
        { id: 'c7-2', name: 'Amministrazione', role: ['Amministrazione'], email: 'amministrazione@cubesys.it' },
    ]},
    { id: '8', sap: '1210011538', name: 'Euro Systems SPA', category: DealerCategory.A, website: 'https://eurosystems.eu/', contacts: [
        { id: 'c8-1', name: 'Simone Neri', role: ['CEO', 'Marketing'], email: 's.neri@eurosystems.eu' },
        { id: 'c8-2', name: 'Paola Bianchi', role: ['Sales', 'Marketing'], email: 'p.bianchi@eurosystems.eu', phone: '3341112233' },
        { id: 'c8-3', name: 'Emanuela Galli', role: ['Sales', 'Marketing'], email: 'e.galli@eurosystems.eu', phone: '3342223344' },
    ]},
    { id: '9', sap: '1210009544', name: 'GeoSolutions SRL', category: DealerCategory.A, website: 'https://www.geosolutions.it/', contacts: [
        { id: 'c9-1', name: 'Marco Colombo', role: ['Purchase'], email: 'm.colombo@geosolutions.it', phone: '3343334455' },
        { id: 'c9-2', name: 'Lorenzo Rinaldi', role: ['Marketing'], email: 'l.rinaldi@geosolutions.it' },
        { id: 'c9-3', name: 'Francesca Santoro', role: ['Purchase'], email: 'f.santoro@geosolutions.it' },
    ]},
    { id: '10', sap: '1210011177', name: 'Tech Services SRL', category: DealerCategory.A, website: 'https://techservices.it/', contacts: [
        { id: 'c10-1', name: 'Supporto DJI', role: ['Supporto'], email: 'dji@techservices.it' },
    ]},
    { id: '11', sap: '1210009625', name: 'Personal Flyers', category: DealerCategory.A, website: 'https://www.personalflyers.it/', contacts: [
        { id: 'c11-1', name: 'Vittorio Longo', role: ['Marketing'], email: 'v.longo@personalflyers.it', phone: '3344445566' },
        { id: 'c11-2', name: 'Ufficio Vendite', role: ['CEO'], email: 'info@personalflyers.it' },
    ]},
    { id: '12', sap: '1210011626', name: 'RAIT Technologies', category: DealerCategory.A, website: 'https://rait-tech.com/', contacts: [
        { id: 'c12-1', name: 'Alessandro Fontana', role: ['CEO'], email: 'a.fontana@rait-tech.com' },
        { id: 'c12-2', name: 'Giulio Leoni', role: ['Marketing'], email: 'g.leoni.pub@example.com' },
        { id: 'c12-3', name: 'Guido Serra', role: ['Consulente'], email: 'g.serra@rait-tech.com' },
    ]},
    { id: '13', sap: '1210011495', name: 'Global Components SRL', category: DealerCategory.A, website: 'https://it.global-components.com/web/', contacts: [
        { id: 'c13-1', name: 'Federico Villa', role: ['Product Manager'], email: 'f.villa@globalcomponents.com' },
        { id: 'c13-2', name: 'Marco Bellini', role: ['Tecnico'], email: 'm.bellini@globalcomponents.com' },
    ]},
    { id: '14', sap: '1210002166', name: 'Video Systems SRL', category: DealerCategory.A, website: 'https://www.videosystems.com', contacts: [
        { id: 'c14-1', name: 'Roberta Ferrara', role: ['Sales'], email: 'r.ferrara@videosystems.com', phone: '3351234567' },
        { id: 'c14-2', name: 'Francesco Mariani', role: ['Sales'], email: 'f.mariani@videosystems.com' },
        { id: 'c14-3', name: 'Info Point', role: ['Info'], email: 'info@videosystems.com', phone: '3352345678' },
    ]},
    { id: '15', sap: '1210001604', name: 'Advanced Comms SRL', category: DealerCategory.B, website: 'https://www.adcomms.it/', contacts: [
        { id: 'c15-1', name: 'Giorgio Barbieri', role: ['CEO'], email: 'g.barbieri@adcomms.it', phone: '3353456789' },
        { id: 'c15-2', name: 'Fabio Martinelli', role: ['Purchase'], email: 'f.martinelli@adcomms.it', phone: '3354567890' },
    ]},
    { id: '16', sap: '1210010665', name: 'Survey Solutions SRL', category: DealerCategory.B, website: 'https://www.surveysolutions.it/', contacts: [
        { id: 'c16-1', name: 'Federica De Luca', role: ['Marketing'], email: 'marketing@surveysolutions.it' },
        { id: 'c16-2', name: 'Andrea Morelli', role: ['CEO'], email: 'a.morelli@surveysolutions.it', phone: '3355678901' },
    ]},
    { id: '17', sap: '1210009117', name: 'FlyTech Store SRL', category: DealerCategory.B, website: 'https://www.flytech.it/', contacts: [
        { id: 'c17-1', name: 'Ermes Vitale', role: ['COCEO'], email: 'e.vitale@flytech.it', phone: '3356789012' },
        { id: 'c17-2', name: 'Ufficio Commerciale', role: ['Commerciale'], email: 'commerciale@flytech.it' },
    ]},
    { id: '18', sap: '1210008352', name: 'Model Biz SRL', category: DealerCategory.B, website: 'https://www.modelbiz.it/', contacts: [
        { id: 'c18-1', name: 'Giuseppe Farina', role: ['CEO'], email: 'g.farina@modelbiz.it', phone: '3357890123' },
        { id: 'c18-2', name: 'Stefania Coppola', role: ['Purchase'], email: 's.coppola@modelbiz.it' },
    ]},
    { id: '19', sap: '1210011458', name: 'Professional Gear', category: DealerCategory.B, website: 'https://www.progear.it/', contacts: [
        { id: 'c19-1', name: 'Raniero Pellegrini', role: ['CEO'], email: 'r.pellegrini@progear.it', phone: '3358901234' },
        { id: 'c19-2', name: 'Sara Gentile', role: ['Marketing'], email: 's.gentile@progear.it' },
        { id: 'c19-3', name: 'Stefano Ferri', role: ['Marketing'], email: 'marketing@progear.it', phone: '3359012345' },
    ]},
    { id: '20', sap: '1210011883', name: 'ExaSolutions S.R.L', category: DealerCategory.B, website: 'https://www.exasolutions.it/', contacts: [
        { id: 'c20-1', name: 'Valeria Lombardi', role: ['Marketing'], email: 'v.lombardi@exasolutions.it' },
        { id: 'c20-2', name: 'Info Point', role: ['Generica'], email: 'info@exasolutions.it' },
    ]},
    { id: '21', sap: '1210010651', name: 'GEC Innovations S.R.L.', category: DealerCategory.B, website: 'https://www.gecinnovations.it/', contacts: [
        { id: 'c21-1', name: 'Amministrazione', role: ['Amministrazione'], email: 'info@gecinnovations.it', phone: '3361234567' },
        { id: 'c21-2', name: 'Stefania D Amico', role: ['Purchase'], email: 's.damico@gecinnovations.it', phone: '3362345678' },
    ]},
    { id: '22', sap: '1210011738', name: 'The Solutions S.R.L', category: DealerCategory.B, website: 'https://www.thesolutions.it/', contacts: [
        { id: 'c22-1', name: 'Maria Rosaria Marino', role: ['Marketing'], email: 'mkt@thesolutions.com', phone: '3363456789' },
        { id: 'c22-2', name: 'Mara De Angelis', role: ['CEO'], email: 'amministrazione@thesolutions.com', phone: '3364567890' },
    ]},
    { id: '23', sap: '1210011885', name: 'FutureWare SCARL', category: DealerCategory.B, website: 'https://futureware.it/', contacts: [
        { id: 'c23-1', name: 'N/A', role: ['N/A'], email: '' },
    ]},
    { id: '24', sap: '1210010730', name: 'Drone Nexus S.R.L', category: DealerCategory.S, website: 'https://dronenexus.it/', contacts: [
        { id: 'c24-1', name: 'Amministrazione', role: ['Amministrazione'], email: 'info@dronenexus.it', phone: '3365678901' },
        { id: 'c24-2', name: 'Fabio Palumbo', role: ['CEO'], email: 'f.palumbo@dronenexus.it' },
        { id: 'c24-3', name: 'Marco Basile', role: ['Purchase', 'Marketing'], email: 'm.basile@dronenexus.it', phone: '3366789012' },
    ]},
    { id: '25', sap: '', name: 'Drone Hub', category: DealerCategory.B, website: '', contacts: [
        { id: 'c25-1', name: 'Fabio Leone', role: ['Info'], email: 'info@drone-hub.it' },
    ]},
    { id: '26', sap: '', name: 'Sky Systems SRL', category: DealerCategory.B, website: 'https://skysystems.net/', contacts: [
        { id: 'c26-1', name: 'Federico Riva', role: ['CEO'], email: 'f.riva@skysystems.net', phone: '3367890123' },
        { id: 'c26-2', name: 'Alessandro Marini', role: ['Co-Ceo', 'Sales'], email: 'a.marini@skysystems.net' },
        { id: 'c26-3', name: 'Cristina Martini', role: ['Amministrazione'], email: 'amministrazione@skysystems.net' },
    ]},
];

export const MOCK_DEALERS: Dealer[] = dealersData;

export const MOCK_GOALS: Goal[] = [
    { id: 'goal-1', category: DealerCategory.B, activityType: 'Evento Fisico', count: 1, startDate: '2025-07-01', endDate: '2025-12-31' },
    { id: 'goal-2', category: DealerCategory.B, activityType: 'Campagna Online', count: 2, startDate: '2025-07-01', endDate: '2025-09-30' },
    { id: 'goal-3', category: DealerCategory.A, activityType: 'Campagna Online', count: 4, startDate: '2025-07-01', endDate: '2025-09-30' },
    { id: 'goal-4', category: DealerCategory.S, activityType: 'Evento Fisico', count: 2, startDate: '2025-07-01', endDate: '2025-12-31' },
    { id: 'goal-5', category: DealerCategory.S, activityType: 'PR', count: 1, startDate: '2025-07-01', endDate: '2025-09-30' },
];

export const MOCK_NOTICES: Notice[] = [
    {
        id: 'notice-4',
        type: NoticeType.IN_PERSON_EVENT,
        title: 'DJI Enterprise Roadshow - Milano',
        content: 'Siamo lieti di invitarvi al nostro roadshow annuale che si terrà a Milano. Sarà un\'occasione per scoprire le ultime novità e fare networking. È richiesta la registrazione dei partecipanti.',
        priority: NoticePriority.HIGH,
        eventDate: '2025-09-20',
        eventTime: '09:30',
        creationDate: '2025-07-20',
        participations: [
            { dealerId: '1', attendees: [
                { id: 'att-1-1', firstName: 'Mario', lastName: 'Rossi', email: 'm.rossi@3dsolutions.it', phone: '3331112233' },
                { id: 'att-1-2', firstName: 'Luca', lastName: 'Bianchi', email: 'l.bianchi@3dsolutions.it', phone: '3331112234' },
            ]},
            { dealerId: '2', attendees: [
                { id: 'att-2-1', firstName: 'Simone', lastName: 'Conti', email: 's.conti@aerotech.com', phone: '3333334455' },
            ]}
        ],
    },
    {
        id: 'notice-1',
        type: NoticeType.WEBINAR,
        title: 'Webinar: Nuove policy di Marketing',
        content: 'A partire dal 1° Agosto 2025, entreranno in vigore le nuove linee guida per le campagne di co-marketing. Partecipate al webinar per tutti i dettagli.',
        priority: NoticePriority.HIGH,
        eventDate: '2025-07-30',
        eventTime: '15:00',
        creationDate: '2025-07-15',
        participations: [{ dealerId: '1', attendees: [] }, { dealerId: '3', attendees: [] }, { dealerId: '5', attendees: [] }],
    },
    {
        id: 'notice-2',
        type: NoticeType.GENERAL,
        title: 'Manutenzione Programmata del Portale',
        content: 'Si avvisa che il portale dealer sarà in manutenzione il giorno 25 Luglio 2025 dalle 02:00 alle 04:00. Potrebbero verificarsi brevi interruzioni del servizio.',
        priority: NoticePriority.MEDIUM,
        creationDate: '2025-07-10',
        participations: [],
    },
     {
        id: 'notice-3',
        type: NoticeType.GENERAL,
        title: 'Nuovi Materiali Promozionali Disponibili',
        content: 'Sono ora disponibili i nuovi kit promozionali per il lancio del prodotto "Mavic 5". Potete scaricarli dalla sezione "Risorse Marketing".',
        priority: NoticePriority.LOW,
        creationDate: '2025-07-05',
        participations: [],
    }
];

// --- Dynamic Form Mock Data ---

const activityReportTemplateId = 'template-1';

export const MOCK_FORM_TEMPLATES: FormTemplate[] = [
  {
    id: activityReportTemplateId,
    title: 'Report Attività Marketing',
    description: 'Utilizza questo modulo per registrare tutte le attività di marketing completate.',
    published: true,
    dealerCanEditSubmissions: true,
    archived: false,
    fields: [
      { id: 'field-1', label: 'Nome Attività', type: FormFieldType.TEXT, required: true },
      { id: 'field-2', label: 'Data Evento', type: FormFieldType.DATE, required: true, isEventDate: true },
      {
        id: 'field-3',
        label: 'Tipo Attività',
        type: FormFieldType.SELECT,
        required: true,
        isGoalLink: true,
        options: [
          { value: 'Webinar', label: 'Webinar', goalCategory: 'Campagna Online' },
          { value: 'Demo Prodotto', label: 'Demo Prodotto', goalCategory: 'Evento Fisico' },
          { value: 'Fiera di Settore', label: 'Fiera di Settore', goalCategory: 'Fiera' },
          { value: 'Post Social', label: 'Post Social', goalCategory: 'Campagna Online' },
          { value: 'Comunicato Stampa', label: 'Comunicato Stampa', goalCategory: 'PR' },
        ],
      },
      { id: 'field-4', label: 'Prodotti Coinvolti', type: FormFieldType.TEXT, required: false },
      { 
        id: 'field-6', 
        label: 'Stato Attività', 
        type: FormFieldType.SELECT, 
        required: true,
        options: [
            { value: 'In Corso', label: 'In Corso' },
            { value: 'Completato', label: 'Completato' },
            { value: 'Annullato', label: 'Annullato' },
        ]
      },
      { 
        id: 'field-7', 
        label: 'Leads Generati', 
        type: FormFieldType.NUMBER, 
        required: true,
        conditions: [{ fieldId: 'field-6', value: 'Completato' }] // Conditional field
      },
      { id: 'field-5', label: 'Note e Risultati', type: FormFieldType.TEXTAREA, required: false },
    ],
  },
  {
    id: 'template-2',
    title: 'Registrazione Lead',
    description: 'Modulo per la registrazione di nuovi lead commerciali.',
    published: true,
    dealerCanEditSubmissions: false,
    archived: false,
    fields: [
        { id: 'field-2-1', label: "Nome Azienda", type: FormFieldType.TEXT, required: true },
        { id: 'field-2-2', label: "Referente", type: FormFieldType.TEXT, required: true },
        { id: 'field-2-3', label: "Email Referente", type: FormFieldType.TEXT, required: true },
        { id: 'field-2-4', label: "Note", type: FormFieldType.TEXTAREA, required: false },
    ]
  },
  {
    id: 'template-3',
    title: 'Richiesta Supporto Tecnico',
    description: 'Modulo per richieste di supporto tecnico.',
    published: true,
    dealerCanEditSubmissions: true,
    archived: true,
    fields: [
        { id: 'field-3-1', label: "Prodotto", type: FormFieldType.TEXT, required: true },
        { id: 'field-3-2', label: "Numero Seriale", type: FormFieldType.TEXT, required: true },
        { id: 'field-3-3', label: "Descrizione Problema", type: FormFieldType.TEXTAREA, required: true },
    ]
  }
];

export const MOCK_FORM_SUBMISSIONS: FormSubmission[] = [
    {
        id: 'sub-1',
        templateId: activityReportTemplateId,
        dealerId: '1', // 3D Solutions
        dealerName: '3D Solutions S.R.L.',
        submissionDate: '2025-07-02',
        status: FormStatus.COMPLETED,
        data: {
            'field-1': 'Webinar Nuovo Matrice 400',
            'field-2': '2025-07-25',
            'field-3': 'Webinar',
            'field-4': 'DJI Matrice 400',
            'field-5': '65 iscritti, grande interesse.',
            'field-6': 'Completato',
            'field-7': 15
        },
        goalValue: 'Campagna Online',
        eventDate: '2025-07-25',
    },
    {
        id: 'sub-2',
        templateId: activityReportTemplateId,
        dealerId: '15', // Advanced Comms SRL
        dealerName: 'Advanced Comms SRL',
        submissionDate: '2025-07-05',
        status: FormStatus.COMPLETED,
        data: {
            'field-1': 'Demo per Protezione Civile',
            'field-2': '2025-08-05',
            'field-3': 'Demo Prodotto',
            'field-4': 'DJI Matrice 350, Mavic 3T',
            'field-5': 'Feedback molto positivo, richiesto preventivo.',
            'field-6': 'Completato',
            'field-7': 3
        },
        goalValue: 'Evento Fisico',
        eventDate: '2025-08-05',
    },
    {
        id: 'sub-3',
        templateId: activityReportTemplateId,
        dealerId: '2', // AeroTech Robotics SRL
        dealerName: 'AeroTech Robotics SRL',
        submissionDate: '2025-07-10',
        status: FormStatus.PENDING,
        data: {
            'field-1': 'Fiera Elettronica',
            'field-2': '2025-09-15',
            'field-3': 'Fiera di Settore',
            'field-4': 'Tutta la gamma Enterprise',
            'field-5': '',
            'field-6': 'In Corso',
        },
        goalValue: 'Fiera',
        eventDate: '2025-09-15',
    },
    {
        id: 'sub-4',
        templateId: 'template-2',
        dealerId: '2', // AeroTech Robotics SRL
        dealerName: 'AeroTech Robotics SRL',
        submissionDate: '2025-07-11',
        status: FormStatus.PENDING,
        data: {
            'field-2-1': "Comune di Milano",
            'field-2-2': "Marco Verdi",
            'field-2-3': "m.verdi@comune.milano.it",
            'field-2-4': "Interessati a droni per Polizia Locale",
        }
    }
];


// --- Dashboard Mock Data ---
export const MOCK_ADMIN_WIDGETS: DashboardWidget[] = [
    {
        id: 'w1', type: WidgetType.STAT_CARD,
        config: { title: 'totalDealers' }
    },
    {
        id: 'w2', type: WidgetType.STAT_CARD,
        config: { title: 'totalSubmissions', formTemplateId: 'template-1' }
    },
    {
        id: 'w3', type: WidgetType.CHART,
        config: { title: 'Submissions by Type', chartType: ChartType.PIE, formTemplateId: 'template-1', groupByFieldId: 'field-3', aggregationType: AggregationType.COUNT }
    },
    {
        id: 'w4', type: WidgetType.CHART,
        config: { title: 'Leads Generated by Activity', chartType: ChartType.BAR, formTemplateId: 'template-1', groupByFieldId: 'field-3', aggregationType: AggregationType.SUM, sumOfFieldId: 'field-7'}
    },
    {
        id: 'w5', type: WidgetType.RECENT_SUBMISSIONS,
        config: { title: 'Recent Marketing Activities', formTemplateId: 'template-1', limit: 5 }
    }
];

export const MOCK_ADMIN_LAYOUT: Layout[] = [
    { i: 'w1', x: 0, y: 0, w: 4, h: 2 },
    { i: 'w2', x: 4, y: 0, w: 4, h: 2 },
    { i: 'w3', x: 8, y: 0, w: 4, h: 4 },
    { i: 'w4', x: 0, y: 2, w: 8, h: 4 },
    { i: 'w5', x: 0, y: 6, w: 12, h: 5 },
];

export const MOCK_DEALER_WIDGETS: DashboardWidget[] = [
    {
        id: 'dw1', type: WidgetType.GOALS,
        config: { title: 'yourGoals' }
    },
    {
        id: 'dw2', type: WidgetType.CHART,
        config: { title: 'My Activities by Type', chartType: ChartType.PIE, formTemplateId: 'template-1', groupByFieldId: 'field-3', aggregationType: AggregationType.COUNT }
    },
    {
        id: 'dw3', type: WidgetType.RECENT_SUBMISSIONS,
        config: { title: 'My Recent Activities', formTemplateId: 'template-1', limit: 5 }
    }
];

export const MOCK_DEALER_LAYOUT: Layout[] = [
    { i: 'dw1', x: 0, y: 0, w: 7, h: 5 },
    { i: 'dw2', x: 7, y: 0, w: 5, h: 5 },
    { i: 'dw3', x: 0, y: 5, w: 12, h: 5 },
];

// --- Sales Forecast Mock Data ---
export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'DJI Matrice 30 Series', category: 'Enterprise' },
  { id: 'prod-2', name: 'DJI Mavic 3 Enterprise Series', category: 'Enterprise' },
  { id: 'prod-3', name: 'DJI Agras T40', category: 'Agriculture' },
  { id: 'prod-4', name: 'DJI Dock', category: 'Enterprise' },
  { id: 'prod-5', name: 'Zenmuse H20N', category: 'Payload' },
];

export const MOCK_SALES_FORECASTS: SalesForecast[] = [
    // Q3 2025 (Open)
    { id: 'sf-1', dealerId: '1', dealerName: '3D Solutions S.R.L.', productId: 'prod-1', productName: 'DJI Matrice 30 Series', year: 2025, quarter: 3, forecastedUnits: 5, actualUnits: 2, status: 'Open' },
    { id: 'sf-2', dealerId: '2', dealerName: 'AeroTech Robotics SRL', productId: 'prod-1', productName: 'DJI Matrice 30 Series', year: 2025, quarter: 3, forecastedUnits: 8, actualUnits: 0, status: 'Open' },
    { id: 'sf-3', dealerId: '15', dealerName: 'Advanced Comms SRL', productId: 'prod-2', productName: 'DJI Mavic 3 Enterprise Series', year: 2025, quarter: 3, forecastedUnits: 10, actualUnits: 0, status: 'Open' },
    { id: 'sf-7', dealerId: '2', dealerName: 'AeroTech Robotics SRL', productId: 'prod-2', productName: 'DJI Mavic 3 Enterprise Series', year: 2025, quarter: 3, forecastedUnits: 12, actualUnits: 5, status: 'Open' },

    // Q2 2025 (Closed)
    { id: 'sf-4', dealerId: '1', dealerName: '3D Solutions S.R.L.', productId: 'prod-2', productName: 'DJI Mavic 3 Enterprise Series', year: 2025, quarter: 2, forecastedUnits: 15, actualUnits: 18, status: 'Closed' },
    { id: 'sf-5', dealerId: '2', dealerName: 'AeroTech Robotics SRL', productId: 'prod-3', productName: 'DJI Agras T40', year: 2025, quarter: 2, forecastedUnits: 4, actualUnits: 3, status: 'Closed' },
    { id: 'sf-6', dealerId: '24', dealerName: 'Drone Nexus S.R.L', productId: 'prod-3', productName: 'DJI Agras T40', year: 2025, quarter: 2, forecastedUnits: 6, actualUnits: 7, status: 'Closed' },
];