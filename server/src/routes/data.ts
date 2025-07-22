import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// Widget data is hardcoded here for now as there's no DB model for it.
const MOCK_ADMIN_WIDGETS_CONFIG = [
    { id: 'w1', type: 'STAT_CARD', config: { title: 'totalDealers' } },
    { id: 'w2', type: 'STAT_CARD', config: { title: 'totalSubmissions', formIdPlaceholder: 'marketing-form' } },
    { id: 'w3', type: 'CHART', config: { title: 'Submissions by Type', chartType: 'PIE', formIdPlaceholder: 'marketing-form', groupByFieldId: 'field-3', aggregationType: 'COUNT' } },
    { id: 'w5', type: 'RECENT_SUBMISSIONS', config: { title: 'Recent Marketing Activities', formIdPlaceholder: 'marketing-form', limit: 5 } }
];
const MOCK_ADMIN_LAYOUT = [
    { i: 'w1', x: 0, y: 0, w: 6, h: 2 },
    { i: 'w2', x: 6, y: 0, w: 6, h: 2 },
    { i: 'w3', x: 0, y: 2, w: 6, h: 4 },
    { i: 'w5', x: 6, y: 2, w: 6, h: 4 },
];
const MOCK_DEALER_WIDGETS_CONFIG = [
    { id: 'dw1', type: 'GOALS', config: { title: 'yourGoals' } },
    { id: 'dw2', type: 'CHART', config: { title: 'My Activities by Type', chartType: 'PIE', formIdPlaceholder: 'marketing-form', groupByFieldId: 'field-3', aggregationType: 'COUNT' } },
    { id: 'dw3', type: 'RECENT_SUBMISSIONS', config: { title: 'My Recent Activities', formIdPlaceholder: 'marketing-form', limit: 5 } }
];
const MOCK_DEALER_LAYOUT = [
    { i: 'dw1', x: 0, y: 0, w: 7, h: 5 },
    { i: 'dw2', x: 7, y: 0, w: 5, h: 5 },
    { i: 'dw3', x: 0, y: 5, w: 12, h: 5 },
];

// GET /api/data/dashboard
router.get('/dashboard', authMiddleware, async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const user = authReq.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const dealersQuery = prisma.dealer.findMany({ include: { contacts: true } });
        const goalsQuery = prisma.goal.findMany();
        const formsQuery = prisma.form.findMany();
        const noticesQuery = prisma.notice.findMany({ orderBy: { creationDate: 'desc' } });
        const productsQuery = prisma.product.findMany();
        
        let usersQuery;
        let submissionsQuery;
        let forecastsQuery;

        if (user.role === 'ADMIN') {
            usersQuery = prisma.user.findMany({
              select: { id: true, email: true, role: true, dealerId: true }
            });
            submissionsQuery = prisma.formSubmission.findMany({ orderBy: { submissionDate: 'desc' } });
            forecastsQuery = prisma.salesForecast.findMany();
        } else if (user.role === 'DEALER' && user.dealerId) {
            usersQuery = Promise.resolve([]); // Dealers don't need all users
            submissionsQuery = prisma.formSubmission.findMany({
                where: { dealerId: user.dealerId },
                orderBy: { submissionDate: 'desc' },
            });
            forecastsQuery = prisma.salesForecast.findMany({
                where: { dealerId: user.dealerId },
            });
        } else {
             usersQuery = Promise.resolve([]);
             submissionsQuery = Promise.resolve([]);
             forecastsQuery = Promise.resolve([]);
        }

        const [users, dealers, goals, forms, submissions, notices, products, salesForecasts] = await Promise.all([
            usersQuery,
            dealersQuery,
            goalsQuery,
            formsQuery,
            submissionsQuery,
            noticesQuery,
            productsQuery,
            forecastsQuery
        ]);
        
        // Dynamically create dashboard data linked to the seeded form
        const marketingForm = forms.find(f => f.title === 'Report Attività Marketing');
        const marketingFormId = marketingForm?.id || null;

        const injectFormId = (widgetConfig: any) => {
            const newConfig = { ...widgetConfig.config };
            if (newConfig.formIdPlaceholder === 'marketing-form') {
                newConfig.formId = marketingFormId;
            }
            delete newConfig.formIdPlaceholder;
            return { ...widgetConfig, config: newConfig };
        };

        const dashboardWidgets = user.role === 'ADMIN' 
            ? MOCK_ADMIN_WIDGETS_CONFIG.map(injectFormId)
            : MOCK_DEALER_WIDGETS_CONFIG.map(injectFormId);
            
        const dashboardLayout = user.role === 'ADMIN' ? MOCK_ADMIN_LAYOUT : MOCK_DEALER_LAYOUT;

        res.json({
            users,
            dealers,
            goals,
            forms,
            submissions,
            notices,
            products,
            salesForecasts,
            dashboardWidgets,
            dashboardLayout
        });

    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});

export default router;