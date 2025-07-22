// This file should be kept in sync with the server's types and Prisma schema.
/// <reference types="vite/client" />

export type UserRole = 'ADMIN' | 'DEALER' | 'GUEST';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  dealerId?: string | null;
  dealer?: Dealer | null;
}

export enum DealerCategory {
  S = 'S',
  A = 'A',
  B = 'B',
}

export interface Contact {
    id: string;
    name: string;
    role: string[];
    email: string;
    phone?: string | null;
    dealerId: string;
}

export interface Dealer {
  id: string;
  sapId?: string | null;
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
    startDate: string; // Stored as ISO string
    endDate: string; // Stored as ISO string
    progress: number;
    note?: string | null;
}

// --- Dynamic Form System ---
// Naming changed from FormTemplate -> Form for consistency with new schema

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

// This was FormTemplate
export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  published: boolean;
  dealerCanEditSubmissions: boolean;
  archived?: boolean;
}

export enum FormStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  ARCHIVED = 'Archived',
}

export interface FormSubmission {
  id: string;
  formId: string;
  dealerId: string;
  userId: string;
  submissionDate: string; // Stored as ISO string
  status: FormStatus;
  data: Record<string, any>; // { fieldId: value }
  
  // These are derived on the frontend, not stored in DB
  goalValue?: GoalActivityType; 
  eventDate?: string;
  dealerName?: string;
}


// --- Notice System ---

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

export interface NoticeParticipation {
    dealerId: string;
    attendees: Attendee[];
}

export interface Notice {
    id: string;
    type: NoticeType;
    title: string;
    content: string;
    eventDate?: string | null; // Stored as ISO string
    eventTime?: string | null;
    priority: NoticePriority;
    creationDate: string; // Stored as ISO string
    participations: NoticeParticipation[];
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
    formId?: string;
    groupByFieldId?: string;
    aggregationType?: AggregationType;
    sumOfFieldId?: string;
    chartType?: ChartType;
    limit?: number;
}

export interface DashboardWidget {
    id: string;
    type: WidgetType;
    config: WidgetConfig;
}

export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    static?: boolean;
}