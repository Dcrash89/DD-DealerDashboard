


export enum UserRole {
  ADMIN = 'Admin',
  DEALER = 'Dealer',
  GUEST = 'Guest',
}

export enum DealerCategory {
  S = 'S',
  A = 'A',
  B = 'B',
}

export enum FormStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  ARCHIVED = 'Archived',
}

export type AppView = 'dashboard' | 'dealers' | 'forms' | 'calendar' | 'addressBook' | 'settings' | 'goals' | 'notices' | 'myTeam' | 'availableForms' | 'mySubmissions' | 'salesForecasts';

export interface Contact {
    id: string;
    name: string;
    role: string[];
    email: string;
    phone?: string;
}

export interface Dealer {
  id: string;
  sapId?: string;
  name: string;
  category: DealerCategory;
  website: string;
  contacts: Contact[];
}

export type GoalActivityType = 'Evento Fisico' | 'Campagna Online' | 'PR' | 'Fiera';

export interface Goal {
    id: string;
    category: DealerCategory;
    activityType: GoalActivityType;
    count: number;
    startDate: string;
    endDate: string;
}

export enum NoticePriority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
}

export enum NoticeType {
    GENERAL = 'GENERAL',
    WEBINAR = 'WEBINAR',
    IN_PERSON_EVENT = 'IN_PERSON_EVENT',
}

export interface Attendee {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface Notice {
    id: string;
    type: NoticeType;
    title: string;
    content: string;
    eventDate?: string;
    eventTime?: string;
    priority: NoticePriority;
    creationDate: string;
    participations: {
        dealerId: string;
        attendees: Attendee[];
    }[];
}


// --- Dynamic Form System ---

export enum FormFieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  SELECT = 'SELECT',
}

export interface FormFieldOption {
  value: string;
  label: string;
  goalCategory?: GoalActivityType;
}

export interface FieldCondition {
  fieldId: string;
  value: any;
}

export interface FormField {
  id:string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: FormFieldOption[]; // For SELECT type
  isGoalLink?: boolean;
  isEventDate?: boolean; // For DATE type
  conditions?: FieldCondition[]; // Conditional logic
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  published: boolean;
  dealerCanEditSubmissions: boolean;
  archived?: boolean;
}

export interface FormSubmission {
  id: string;
  templateId: string;
  dealerId: string;
  dealerName: string;
  submissionDate: string;
  status: FormStatus;
  data: Record<string, any>; // { fieldId: value }
  goalValue?: GoalActivityType;
  eventDate?: string;
}

// --- Customizable Dashboard System ---
export enum WidgetType {
    STAT_CARD = 'STAT_CARD',
    CHART = 'CHART',
    GOALS = 'GOALS',
    RECENT_SUBMISSIONS = 'RECENT_SUBMISSIONS'
}

export enum ChartType {
    BAR = 'BAR',
    LINE = 'LINE',
    PIE = 'PIE'
}

export enum AggregationType {
    COUNT = 'COUNT',
    SUM = 'SUM'
}

export interface WidgetConfig {
    title: string;
    // Data source
    formTemplateId?: string;
    // Aggregation
    groupByFieldId?: string; // Field to group by (e.g., status, type)
    aggregationType?: AggregationType;
    sumOfFieldId?: string; // Field to sum (if aggregation is SUM)
    // Presentation
    chartType?: ChartType;
    limit?: number; // For recent submissions
}

export interface DashboardWidget {
    id: string;
    type: WidgetType;
    config: WidgetConfig;
}

export interface Layout {
    i: string; // widget id
    x: number;
    y: number;
    w: number;
    h: number;
    static?: boolean;
}

// --- Sales Forecast System ---
export interface Product {
    id: string;
    name: string;
    category: 'Enterprise' | 'Agriculture' | 'Payload';
}

export interface SalesForecast {
  id: string;
  dealerId: string;
  dealerName: string;
  productId: string;
  productName: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  forecastedUnits: number;
  actualUnits: number;
  status: 'Open' | 'Closed';
}