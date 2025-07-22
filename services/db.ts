import { Dealer, Goal, Notice, FormTemplate, FormSubmission, UserRole, DashboardWidget, Layout, Product, SalesForecast } from "../types";
import { MOCK_DEALERS, MOCK_GOALS, MOCK_NOTICES, MOCK_FORM_TEMPLATES, MOCK_FORM_SUBMISSIONS, MOCK_ADMIN_WIDGETS, MOCK_ADMIN_LAYOUT, MOCK_DEALER_WIDGETS, MOCK_DEALER_LAYOUT, MOCK_PRODUCTS, MOCK_SALES_FORECASTS } from '../constants/mockData';

// NOTE: The Firebase implementation has been temporarily replaced with mock data
// to resolve initialization errors and allow the application to run correctly.
// The original Firebase code can be restored once the Firebase environment is set up.

export const getDealers = (): Promise<Dealer[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_DEALERS);
        }, 300);
    });
};

export const getGoals = (): Promise<Goal[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_GOALS);
        }, 300);
    });
};

export const getNotices = (): Promise<Notice[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_NOTICES);
        }, 300);
    });
};

export const getFormTemplates = (): Promise<FormTemplate[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_FORM_TEMPLATES);
        }, 300);
    });
}

export const getFormSubmissions = (): Promise<FormSubmission[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_FORM_SUBMISSIONS);
        }, 300);
    });
}


export const getDashboardWidgets = (role: UserRole): Promise<DashboardWidget[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (role === UserRole.ADMIN) {
                resolve(JSON.parse(JSON.stringify(MOCK_ADMIN_WIDGETS)));
            } else {
                 resolve(JSON.parse(JSON.stringify(MOCK_DEALER_WIDGETS)));
            }
        }, 300);
    });
};


export const getDashboardLayout = (role: UserRole): Promise<Layout[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (role === UserRole.ADMIN) {
                resolve(JSON.parse(JSON.stringify(MOCK_ADMIN_LAYOUT)));
            } else {
                resolve(JSON.parse(JSON.stringify(MOCK_DEALER_LAYOUT)));
            }
        }, 300);
    });
};

export const getProducts = (): Promise<Product[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_PRODUCTS);
        }, 300);
    });
};

export const getSalesForecasts = (): Promise<SalesForecast[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_SALES_FORECASTS);
        }, 300);
    });
};