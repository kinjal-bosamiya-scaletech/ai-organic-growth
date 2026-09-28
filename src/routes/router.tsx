import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AdminRoute } from '@/components/common/AdminRoute';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { RootLayout } from '@/routes/RootLayout';

const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const ProjectsPage = lazy(() =>
  import('@/features/projects/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const RecommendationsPage = lazy(() =>
  import('@/features/recommendations/RecommendationsPage').then((m) => ({
    default: m.RecommendationsPage,
  }))
);
const ContentGenerationPage = lazy(() =>
  import('@/features/content-generation/ContentGenerationPage').then((m) => ({
    default: m.ContentGenerationPage,
  }))
);
const SeoAnalysisPage = lazy(() =>
  import('@/features/seo-analysis/SeoAnalysisPage').then((m) => ({ default: m.SeoAnalysisPage }))
);
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const FreeToolsPage = lazy(() =>
  import('@/features/free-tools/FreeToolsPage').then((m) => ({ default: m.FreeToolsPage }))
);
const LinkGapPage = lazy(() =>
  import('@/features/free-tools/LinkGapPage').then((m) => ({ default: m.LinkGapPage }))
);
const PageAuditPage = lazy(() =>
  import('@/features/free-tools/PageAuditPage').then((m) => ({ default: m.PageAuditPage }))
);
const CaseConverterPage = lazy(() =>
  import('@/features/free-tools/CaseConverterPage').then((m) => ({ default: m.CaseConverterPage }))
);
const SmallTextGeneratorPage = lazy(() =>
  import('@/features/free-tools/SmallTextGeneratorPage').then((m) => ({
    default: m.SmallTextGeneratorPage,
  }))
);
const CoreWebVitalsPage = lazy(() =>
  import('@/features/free-tools/CoreWebVitalsPage').then((m) => ({
    default: m.CoreWebVitalsPage,
  }))
);
const BuiltWithPage = lazy(() =>
  import('@/features/free-tools/BuiltWithPage').then((m) => ({ default: m.BuiltWithPage }))
);
const ArticleTitleGeneratorPage = lazy(() =>
  import('@/features/free-tools/ArticleTitleGeneratorPage').then((m) => ({
    default: m.ArticleTitleGeneratorPage,
  }))
);
const BestKeywordsPage = lazy(() =>
  import('@/features/free-tools/BestKeywordsPage').then((m) => ({ default: m.BestKeywordsPage }))
);
const UserMonitoringPage = lazy(() =>
  import('@/features/user-monitoring/UserMonitoringPage').then((m) => ({
    default: m.UserMonitoringPage,
  }))
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      {
        element: <AuthLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/login', element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/projects', element: <ProjectsPage />, errorElement: <RouteErrorBoundary /> },
          {
            element: <AdminRoute />,
            errorElement: <RouteErrorBoundary />,
            children: [
              {
                path: '/admin/user-monitoring',
                element: <UserMonitoringPage />,
                errorElement: <RouteErrorBoundary />,
              },
            ],
          },
          {
            path: '/app/:projectId',
            element: <AppLayout />,
            errorElement: <RouteErrorBoundary />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              {
                path: 'dashboard',
                element: <DashboardPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'competitors',
                element: <RecommendationsPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'content-generation',
                element: <ContentGenerationPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'seo-analysis',
                element: <SeoAnalysisPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools',
                element: <FreeToolsPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools/link-gap',
                element: <LinkGapPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools/page-audit',
                element: <PageAuditPage />,
              },
              {
                path: 'free-tools/case-converter',
                element: <CaseConverterPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools/small-text-generator',
                element: <SmallTextGeneratorPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools/core-web-vitals',
                element: <CoreWebVitalsPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools/built-with',
                element: <BuiltWithPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools/article-title-generator',
                element: <ArticleTitleGeneratorPage />,
                errorElement: <RouteErrorBoundary />,
              },
              {
                path: 'free-tools/best-keywords',
                element: <BestKeywordsPage />,
                errorElement: <RouteErrorBoundary />,
              },
              { path: 'settings', element: <SettingsPage />, errorElement: <RouteErrorBoundary /> },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);
