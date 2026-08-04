import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// ─── Layouts ─────────────────────────────────────────────────────────────────
import { PublicLayout } from '@layouts/PublicLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { ClientDashboardLayout } from '@layouts/ClientDashboardLayout';
import { WorkerDashboardLayout } from '@layouts/WorkerDashboardLayout';
import { AdminDashboardLayout } from '@layouts/AdminDashboardLayout';

// ─── Pages ───────────────────────────────────────────────────────────────────
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@pages/ResetPasswordPage';
import { VerifyEmailPage } from '@pages/VerifyEmailPage';
import { ProfilePage } from '@pages/ProfilePage';
import { DashboardRouter } from '@pages/dashboard/DashboardRouter';
import { ClientDashboardPage } from '@pages/client/ClientDashboardPage';
import { WorkerDashboardPage } from '@pages/worker/WorkerDashboardPage';
import { AdminDashboardPage } from '@pages/admin/AdminDashboardPage';
import { WorkerSearchPage } from '@pages/worker/WorkerSearchPage';
import { PublicWorkerProfilePage } from '@pages/worker/PublicWorkerProfilePage';
import { EditWorkerProfilePage } from '@pages/worker/EditWorkerProfilePage';
import { EditClientProfilePage } from '@pages/client/EditClientProfilePage';
import { FavoriteWorkersPage } from '@pages/client/FavoriteWorkersPage';

// Contract Pages
import { ContractsListPage } from '@pages/contract/ContractsListPage';
import { CreateContractPage } from '@pages/contract/CreateContractPage';
import { ContractDetailsPage } from '@pages/contract/ContractDetailsPage';
import { EditContractPage } from '@pages/contract/EditContractPage';
import { ContractVersionHistoryPage } from '@pages/contract/ContractVersionHistoryPage';
import { ContractPdfPreviewPage } from '@pages/contract/ContractPdfPreviewPage';

// Escrow Pages
import { WalletDashboardPage } from '@pages/escrow/WalletDashboardPage';
import { TransactionHistoryPage } from '@pages/escrow/TransactionHistoryPage';
import { InvoicesListPage } from '@pages/escrow/InvoicesListPage';
import { InvoiceDetailsPage } from '@pages/escrow/InvoiceDetailsPage';

// Project Pages
import { ProjectsListPage } from '@pages/project/ProjectsListPage';
import { CreateProjectPage } from '@pages/project/CreateProjectPage';
import { ProjectDetailsPage } from '@pages/project/ProjectDetailsPage';
import { EditProjectPage } from '@pages/project/EditProjectPage';

// Communication & Chat Pages
import { ChatPage } from '@pages/chat/ChatPage';

// Analytics & Reports Pages
import { ClientAnalyticsPage } from '@pages/analytics/ClientAnalyticsPage';
import { WorkerAnalyticsPage } from '@pages/analytics/WorkerAnalyticsPage';
import { AdminAnalyticsPage } from '@pages/analytics/AdminAnalyticsPage';
import { ReportsPage } from '@pages/analytics/ReportsPage';

// Notification, Activity & Preferences Pages
import { NotificationsPage } from '@pages/notification/NotificationsPage';
import { ActivityCenterPage } from '@pages/notification/ActivityCenterPage';
import { UserPreferencesPage } from '@pages/notification/UserPreferencesPage';

// AI Assistant, Global Search & Productivity Pages
import { AIAssistantPage } from '@pages/ai/AIAssistantPage';
import { SearchResultsPage } from '@pages/search/SearchResultsPage';
import { BookmarksPage } from '@pages/productivity/BookmarksPage';

// Admin, Organization & Integration Hub Pages
import { OrganizationsPage } from '@pages/organization/OrganizationsPage';
import { MemberManagementPage } from '@pages/organization/MemberManagementPage';
import { ApiKeysPage } from '@pages/integration/ApiKeysPage';
import { WebhookPage } from '@pages/integration/WebhookPage';
import { IntegrationHubPage } from '@pages/integration/IntegrationHubPage';
import { FeatureFlagsPage } from '@pages/admin/FeatureFlagsPage';
import { PlatformSettingsPage } from '@pages/admin/PlatformSettingsPage';
import { AnnouncementsPage } from '@pages/admin/AnnouncementsPage';

// Security, File Management & Operations Pages
import { SecurityDashboardPage } from '@pages/security/SecurityDashboardPage';
import { FileManagerPage } from '@pages/file/FileManagerPage';
import { OperationsCenterPage } from '@pages/operation/OperationsCenterPage';
import { BackupCenterPage } from '@pages/operation/BackupCenterPage';
import { CompliancePage } from '@pages/operation/CompliancePage';

// Talent Marketplace Pages
import { JobsExplorerPage } from '@pages/marketplace/JobsExplorerPage';
import { JobDetailsPage } from '@pages/marketplace/JobDetailsPage';
import { CreateJobPage } from '@pages/marketplace/CreateJobPage';
import { HiringPipelinePage } from '@pages/marketplace/HiringPipelinePage';

// Talent Discovery & Recommendation Pages
import { TalentDiscoveryPage } from '@pages/talent/TalentDiscoveryPage';
import { TalentPoolsPage } from '@pages/talent/TalentPoolsPage';
import { RecommendationsPage } from '@pages/talent/RecommendationsPage';
import { CandidateComparisonPage } from '@pages/talent/CandidateComparisonPage';

// Phase 4 Part 3: Workforce Operations & Productivity Pages
import { WorkforceDashboardPage } from '@pages/workforce/WorkforceDashboardPage';
import { SchedulesPage } from '@pages/workforce/SchedulesPage';
import { AttendancePage } from '@pages/workforce/AttendancePage';
import { TimesheetsPage } from '@pages/workforce/TimesheetsPage';
import { CapacityPlanningPage } from '@pages/workforce/CapacityPlanningPage';
import { ResourceAllocationPage } from '@pages/workforce/ResourceAllocationPage';
import { LeaveManagementPage } from '@pages/workforce/LeaveManagementPage';
import { ProductivityPage } from '@pages/workforce/ProductivityPage';

// Phase 4 Part 4: Support & Service Operations Pages
import { SupportDashboardPage } from '@pages/support/SupportDashboardPage';
import { MyTicketsPage } from '@pages/support/MyTicketsPage';
import { TicketDetailsPage } from '@pages/support/TicketDetailsPage';
import { KnowledgeBasePage } from '@pages/support/KnowledgeBasePage';
import { KnowledgeArticlePage } from '@pages/support/KnowledgeArticlePage';
import { DisputeCenterPage } from '@pages/support/DisputeCenterPage';
import { CustomerFeedbackPage } from '@pages/support/CustomerFeedbackPage';
import { SLAMonitorPage } from '@pages/support/SLAMonitorPage';

// Phase 4 Part 5: Enterprise Finance, Billing & Business Operations Pages
import { FinanceDashboardPage } from '@pages/finance/FinanceDashboardPage';
import { SubscriptionsPage } from '@pages/finance/SubscriptionsPage';
import { BillingPage } from '@pages/finance/BillingPage';
import { PaymentMethodsPage } from '@pages/finance/PaymentMethodsPage';
import { BudgetsPage } from '@pages/finance/BudgetsPage';
import { FinancialReportsPage } from '@pages/finance/FinancialReportsPage';
import { BusinessMetricsPage } from '@pages/finance/BusinessMetricsPage';

// Phase 4 Part 6: Enterprise BI & Decision Intelligence Pages
import { ExecutiveDashboardPage } from '@pages/analytics/ExecutiveDashboardPage';
import { BusinessIntelligencePage } from '@pages/analytics/BusinessIntelligencePage';
import { KPIManagementPage } from '@pages/analytics/KPIManagementPage';
import { ForecastPage } from '@pages/analytics/ForecastPage';
import { ExecutiveReportsPage } from '@pages/analytics/ExecutiveReportsPage';
import { BusinessGoalsPage } from '@pages/analytics/BusinessGoalsPage';
import { DecisionInsightsPage } from '@pages/analytics/DecisionInsightsPage';

// Phase 4 Part 7: Enterprise Platform Governance & Finalization Pages
import { PlatformDashboardPage } from '@pages/platform/PlatformDashboardPage';
import { ConfigurationPage } from '@pages/platform/ConfigurationPage';
import { PlatformHealthPage } from '@pages/platform/PlatformHealthPage';
import { DiagnosticsPage } from '@pages/platform/DiagnosticsPage';
import { ReleaseManagementPage } from '@pages/platform/ReleaseManagementPage';
import { VersionHistoryPage } from '@pages/platform/VersionHistoryPage';
import { GovernancePage } from '@pages/platform/GovernancePage';
import { MaintenancePage } from '@pages/platform/MaintenancePage';

// Phase 5 Part 1: Enterprise Administration & Platform Control Center Pages
import { UserManagementPage } from '@pages/admin/UserManagementPage';
import { ContractManagementPage } from '@pages/admin/ContractManagementPage';
import { WalletManagementPage } from '@pages/admin/WalletManagementPage';
import { VerificationCenterPage } from '@pages/admin/VerificationCenterPage';
import { ApprovalCenterPage } from '@pages/admin/ApprovalCenterPage';
import { AnnouncementsPage as AnnouncementsCenterPage } from '@pages/admin/AnnouncementsPage';
import { BulkOperationsPage } from '@pages/admin/BulkOperationsPage';
import { PlatformMonitoringPage } from '@pages/admin/PlatformMonitoringPage';
import { AdministrativeAuditPage } from '@pages/admin/AdministrativeAuditPage';

// Phase 5 Part 2: Executive Analytics, AI Reports & BI Center Pages
import { ExecutiveDashboardPage as ExecutiveAnalyticsDashboardPage } from '@pages/executive-analytics/ExecutiveDashboardPage';
import { ExecutiveReportsPage as ExecutiveAnalyticsReportsPage } from '@pages/executive-analytics/ExecutiveReportsPage';
import { AnalyticsCenterPage } from '@pages/executive-analytics/AnalyticsCenterPage';
import { ReportHistoryPage } from '@pages/executive-analytics/ReportHistoryPage';
import { ReportSchedulerPage } from '@pages/executive-analytics/ReportSchedulerPage';
import { ExecutiveAlertsPage } from '@pages/executive-analytics/ExecutiveAlertsPage';
import { KPIBenchmarkPage } from '@pages/executive-analytics/KPIBenchmarkPage';
import { DashboardCustomizationPage } from '@pages/executive-analytics/DashboardCustomizationPage';

// Phase 5 Part 4: Enterprise Performance Optimization & RC Hardening Pages
import { PerformanceDashboardPage } from '@pages/performance/PerformanceDashboardPage';
import { RuntimeMonitoringPage } from '@pages/performance/RuntimeMonitoringPage';
import { BundleAnalysisPage } from '@pages/performance/BundleAnalysisPage';
import { CacheManagementPage } from '@pages/performance/CacheManagementPage';
import { DatabaseOptimizationPage } from '@pages/performance/DatabaseOptimizationPage';
import { LoadTestingPage } from '@pages/performance/LoadTestingPage';
import { ScalabilityPage } from '@pages/performance/ScalabilityPage';
import { ReleaseCandidatePage } from '@pages/performance/ReleaseCandidatePage';

// Phase 5 Part 5: Enterprise Final Testing, Release Validation & v2.0 Final Lock Pages
import { ReleaseDashboardPage } from '@pages/release/ReleaseDashboardPage';
import { RegressionTestingPage } from '@pages/release/RegressionTestingPage';
import { SecurityValidationPage } from '@pages/release/SecurityValidationPage';
import { DeploymentCenterPage } from '@pages/release/DeploymentCenterPage';
import { ComplianceCenterPage } from '@pages/release/ComplianceCenterPage';
import { DisasterRecoveryPage } from '@pages/release/DisasterRecoveryPage';
import { GoLiveReadinessPage } from '@pages/release/GoLiveReadinessPage';
import { ProductionAcceptancePage } from '@pages/release/ProductionAcceptancePage';

import { NotFoundPage } from '@pages/NotFoundPage';
import { ServerErrorPage } from '@pages/ServerErrorPage';
import { ErrorPage } from '@pages/ErrorPage';

/**
 * Application Router
 */
export const router = createBrowserRouter([
  // ─── Public & Protected General Routes (Public Layout) ──────────────────────
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'workers',
        element: <WorkerSearchPage />,
      },
      {
        path: 'workers/:slugOrId',
        element: <PublicWorkerProfilePage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      // ─── Phase 2 Part 2: Contracts Routes ─────────────────────────────────
      {
        path: 'contracts',
        element: (
          <ProtectedRoute>
            <ContractsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contracts/create',
        element: (
          <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
            <CreateContractPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contracts/:id',
        element: (
          <ProtectedRoute>
            <ContractDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contracts/:id/edit',
        element: (
          <ProtectedRoute>
            <EditContractPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contracts/:id/versions',
        element: (
          <ProtectedRoute>
            <ContractVersionHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contracts/:id/pdf',
        element: (
          <ProtectedRoute>
            <ContractPdfPreviewPage />
          </ProtectedRoute>
        ),
      },
      // ─── Phase 2 Part 3: Escrow Wallet & Payment Routes ───────────────────
      {
        path: 'wallet',
        element: (
          <ProtectedRoute>
            <WalletDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'wallet/transactions',
        element: (
          <ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'invoices',
        element: (
          <ProtectedRoute>
            <InvoicesListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'invoices/:id',
        element: (
          <ProtectedRoute>
            <InvoiceDetailsPage />
          </ProtectedRoute>
        ),
      },
      // ─── Phase 2 Part 4: Project Management Routes ───────────────────────
      {
        path: 'projects',
        element: (
          <ProtectedRoute>
            <ProjectsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects/create',
        element: (
          <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
            <CreateProjectPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects/:id',
        element: (
          <ProtectedRoute>
            <ProjectDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects/:id/edit',
        element: (
          <ProtectedRoute>
            <EditProjectPage />
          </ProtectedRoute>
        ),
      },
      // ─── Phase 2 Part 5: Communication & Collaboration Routes ───────────
      {
        path: 'messages',
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat',
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      // ─── Phase 2 Part 6: Analytics & Business Dashboard Routes ──────────
      {
        path: 'analytics',
        element: (
          <ProtectedRoute>
            <ClientAnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      // ─── Phase 3 Part 1: Notification, Activity & Preferences Routes ─────
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'activity',
        element: (
          <ProtectedRoute>
            <ActivityCenterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'preferences',
        element: (
          <ProtectedRoute>
            <UserPreferencesPage />
          </ProtectedRoute>
        ),
      },
      // ─── Phase 3 Part 2: AI Assistant, Global Search & Productivity Routes ─
      {
        path: 'ai',
        element: (
          <ProtectedRoute>
            <AIAssistantPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'search',
        element: (
          <ProtectedRoute>
            <SearchResultsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookmarks',
        element: (
          <ProtectedRoute>
            <BookmarksPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ─── Phase 1 Part 2: Auth Routes (Auth Layout) ─────────────────────────────
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
    ],
  },

  // ─── Phase 1 Part 3 & Phase 2 Part 1: Dashboard Routes ─────────────────────
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/client',
    element: (
      <ProtectedRoute allowedRoles={['CLIENT']}>
        <ClientDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ClientDashboardPage /> },
      { path: 'profile/edit', element: <EditClientProfilePage /> },
      { path: 'favorites', element: <FavoriteWorkersPage /> },
      { path: 'projects', element: <ProjectsListPage /> },
      { path: 'contracts', element: <ContractsListPage /> },
      { path: 'wallet', element: <WalletDashboardPage /> },
      { path: 'messages', element: <ChatPage /> },
      { path: 'analytics', element: <ClientAnalyticsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'activity', element: <ActivityCenterPage /> },
      { path: 'preferences', element: <UserPreferencesPage /> },
      { path: 'ai', element: <AIAssistantPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'organizations', element: <OrganizationsPage /> },
      { path: 'members', element: <MemberManagementPage /> },
      { path: 'api-keys', element: <ApiKeysPage /> },
      { path: 'webhooks', element: <WebhookPage /> },
      { path: 'integrations', element: <IntegrationHubPage /> },
      { path: 'security', element: <SecurityDashboardPage /> },
      { path: 'files', element: <FileManagerPage /> },
      { path: 'operations', element: <OperationsCenterPage /> },
      { path: 'compliance', element: <CompliancePage /> },
      { path: 'marketplace', element: <JobsExplorerPage /> },
      { path: 'marketplace/create', element: <CreateJobPage /> },
      { path: 'marketplace/:slug', element: <JobDetailsPage /> },
      { path: 'marketplace/:jobId/pipeline', element: <HiringPipelinePage /> },
      { path: 'talent', element: <TalentDiscoveryPage /> },
      { path: 'talent/pools', element: <TalentPoolsPage /> },
      { path: 'talent/recommendations', element: <RecommendationsPage /> },
      { path: 'talent/compare', element: <CandidateComparisonPage /> },
      { path: 'workforce', element: <WorkforceDashboardPage /> },
      { path: 'workforce/schedules', element: <SchedulesPage /> },
      { path: 'workforce/attendance', element: <AttendancePage /> },
      { path: 'workforce/timesheets', element: <TimesheetsPage /> },
      { path: 'workforce/capacity', element: <CapacityPlanningPage /> },
      { path: 'workforce/allocations', element: <ResourceAllocationPage /> },
      { path: 'workforce/leave', element: <LeaveManagementPage /> },
      { path: 'workforce/productivity', element: <ProductivityPage /> },
      { path: 'support', element: <SupportDashboardPage /> },
      { path: 'support/tickets', element: <MyTicketsPage /> },
      { path: 'support/tickets/:id', element: <TicketDetailsPage /> },
      { path: 'support/knowledge', element: <KnowledgeBasePage /> },
      { path: 'support/knowledge/:slug', element: <KnowledgeArticlePage /> },
      { path: 'support/disputes', element: <DisputeCenterPage /> },
      { path: 'support/feedback', element: <CustomerFeedbackPage /> },
      { path: 'support/sla', element: <SLAMonitorPage /> },
      { path: 'finance', element: <FinanceDashboardPage /> },
      { path: 'finance/subscriptions', element: <SubscriptionsPage /> },
      { path: 'finance/billing', element: <BillingPage /> },
      { path: 'finance/payment-methods', element: <PaymentMethodsPage /> },
      { path: 'finance/budgets', element: <BudgetsPage /> },
      { path: 'finance/reports', element: <FinancialReportsPage /> },
      { path: 'finance/metrics', element: <BusinessMetricsPage /> },
      { path: 'bi', element: <ExecutiveDashboardPage /> },
      { path: 'bi/hub', element: <BusinessIntelligencePage /> },
      { path: 'bi/kpis', element: <KPIManagementPage /> },
      { path: 'bi/forecasts', element: <ForecastPage /> },
      { path: 'bi/reports', element: <ExecutiveReportsPage /> },
      { path: 'bi/goals', element: <BusinessGoalsPage /> },
      { path: 'bi/insights', element: <DecisionInsightsPage /> },
      { path: 'platform', element: <PlatformDashboardPage /> },
      { path: 'platform/configuration', element: <ConfigurationPage /> },
      { path: 'platform/health', element: <PlatformHealthPage /> },
      { path: 'platform/diagnostics', element: <DiagnosticsPage /> },
      { path: 'platform/releases', element: <ReleaseManagementPage /> },
      { path: 'platform/versions', element: <VersionHistoryPage /> },
      { path: 'platform/governance', element: <GovernancePage /> },
      { path: 'platform/maintenance', element: <MaintenancePage /> },
      { path: '*', element: <ClientDashboardPage /> },
    ],
  },
  {
    path: '/dashboard/worker',
    element: (
      <ProtectedRoute allowedRoles={['WORKER']}>
        <WorkerDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <WorkerDashboardPage /> },
      { path: 'profile/edit', element: <EditWorkerProfilePage /> },
      { path: 'projects', element: <ProjectsListPage /> },
      { path: 'contracts', element: <ContractsListPage /> },
      { path: 'wallet', element: <WalletDashboardPage /> },
      { path: 'messages', element: <ChatPage /> },
      { path: 'analytics', element: <WorkerAnalyticsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'activity', element: <ActivityCenterPage /> },
      { path: 'preferences', element: <UserPreferencesPage /> },
      { path: 'ai', element: <AIAssistantPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'workforce', element: <WorkforceDashboardPage /> },
      { path: 'workforce/schedules', element: <SchedulesPage /> },
      { path: 'workforce/attendance', element: <AttendancePage /> },
      { path: 'workforce/timesheets', element: <TimesheetsPage /> },
      { path: 'workforce/leave', element: <LeaveManagementPage /> },
      { path: 'workforce/productivity', element: <ProductivityPage /> },
      { path: 'support', element: <SupportDashboardPage /> },
      { path: 'support/tickets', element: <MyTicketsPage /> },
      { path: 'support/tickets/:id', element: <TicketDetailsPage /> },
      { path: 'support/knowledge', element: <KnowledgeBasePage /> },
      { path: 'support/knowledge/:slug', element: <KnowledgeArticlePage /> },
      { path: 'support/disputes', element: <DisputeCenterPage /> },
      { path: 'support/feedback', element: <CustomerFeedbackPage /> },
      { path: 'support/sla', element: <SLAMonitorPage /> },
      { path: 'finance', element: <FinanceDashboardPage /> },
      { path: 'finance/subscriptions', element: <SubscriptionsPage /> },
      { path: 'finance/billing', element: <BillingPage /> },
      { path: 'finance/payment-methods', element: <PaymentMethodsPage /> },
      { path: 'finance/budgets', element: <BudgetsPage /> },
      { path: 'finance/reports', element: <FinancialReportsPage /> },
      { path: 'finance/metrics', element: <BusinessMetricsPage /> },
      { path: 'bi', element: <ExecutiveDashboardPage /> },
      { path: 'bi/hub', element: <BusinessIntelligencePage /> },
      { path: 'bi/kpis', element: <KPIManagementPage /> },
      { path: 'bi/forecasts', element: <ForecastPage /> },
      { path: 'bi/reports', element: <ExecutiveReportsPage /> },
      { path: 'bi/goals', element: <BusinessGoalsPage /> },
      { path: 'bi/insights', element: <DecisionInsightsPage /> },
      { path: 'platform', element: <PlatformDashboardPage /> },
      { path: 'platform/configuration', element: <ConfigurationPage /> },
      { path: 'platform/health', element: <PlatformHealthPage /> },
      { path: 'platform/diagnostics', element: <DiagnosticsPage /> },
      { path: 'platform/releases', element: <ReleaseManagementPage /> },
      { path: 'platform/versions', element: <VersionHistoryPage /> },
      { path: 'platform/governance', element: <GovernancePage /> },
      { path: 'platform/maintenance', element: <MaintenancePage /> },
      { path: '*', element: <WorkerDashboardPage /> },
    ],
  },
  {
    path: '/dashboard/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'activity', element: <ActivityCenterPage /> },
      { path: 'preferences', element: <UserPreferencesPage /> },
      { path: 'ai', element: <AIAssistantPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'organizations', element: <OrganizationsPage /> },
      { path: 'members', element: <MemberManagementPage /> },
      { path: 'feature-flags', element: <FeatureFlagsPage /> },
      { path: 'settings', element: <PlatformSettingsPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'api-keys', element: <ApiKeysPage /> },
      { path: 'webhooks', element: <WebhookPage /> },
      { path: 'integrations', element: <IntegrationHubPage /> },
      { path: 'security', element: <SecurityDashboardPage /> },
      { path: 'files', element: <FileManagerPage /> },
      { path: 'operations', element: <OperationsCenterPage /> },
      { path: 'backups', element: <BackupCenterPage /> },
      { path: 'compliance', element: <CompliancePage /> },
      { path: 'marketplace', element: <JobsExplorerPage /> },
      { path: 'talent', element: <TalentDiscoveryPage /> },
      { path: 'contracts', element: <ContractsListPage /> },
      { path: 'wallet', element: <WalletDashboardPage /> },
      { path: 'workforce', element: <WorkforceDashboardPage /> },
      { path: 'workforce/schedules', element: <SchedulesPage /> },
      { path: 'workforce/attendance', element: <AttendancePage /> },
      { path: 'workforce/timesheets', element: <TimesheetsPage /> },
      { path: 'workforce/capacity', element: <CapacityPlanningPage /> },
      { path: 'workforce/allocations', element: <ResourceAllocationPage /> },
      { path: 'workforce/leave', element: <LeaveManagementPage /> },
      { path: 'workforce/productivity', element: <ProductivityPage /> },
      { path: 'support', element: <SupportDashboardPage /> },
      { path: 'support/tickets', element: <MyTicketsPage /> },
      { path: 'support/tickets/:id', element: <TicketDetailsPage /> },
      { path: 'support/knowledge', element: <KnowledgeBasePage /> },
      { path: 'support/knowledge/:slug', element: <KnowledgeArticlePage /> },
      { path: 'support/disputes', element: <DisputeCenterPage /> },
      { path: 'support/feedback', element: <CustomerFeedbackPage /> },
      { path: 'support/sla', element: <SLAMonitorPage /> },
      { path: 'finance', element: <FinanceDashboardPage /> },
      { path: 'finance/subscriptions', element: <SubscriptionsPage /> },
      { path: 'finance/billing', element: <BillingPage /> },
      { path: 'finance/payment-methods', element: <PaymentMethodsPage /> },
      { path: 'finance/budgets', element: <BudgetsPage /> },
      { path: 'finance/reports', element: <FinancialReportsPage /> },
      { path: 'finance/metrics', element: <BusinessMetricsPage /> },
      { path: 'bi', element: <ExecutiveDashboardPage /> },
      { path: 'bi/hub', element: <BusinessIntelligencePage /> },
      { path: 'bi/kpis', element: <KPIManagementPage /> },
      { path: 'bi/forecasts', element: <ForecastPage /> },
      { path: 'bi/reports', element: <ExecutiveReportsPage /> },
      { path: 'bi/goals', element: <BusinessGoalsPage /> },
      { path: 'bi/insights', element: <DecisionInsightsPage /> },
      { path: 'platform', element: <PlatformDashboardPage /> },
      { path: 'platform/configuration', element: <ConfigurationPage /> },
      { path: 'platform/health', element: <PlatformHealthPage /> },
      { path: 'platform/diagnostics', element: <DiagnosticsPage /> },
      { path: 'platform/releases', element: <ReleaseManagementPage /> },
      { path: 'platform/versions', element: <VersionHistoryPage /> },
      { path: 'platform/governance', element: <GovernancePage /> },
      { path: 'platform/maintenance', element: <MaintenancePage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'contracts-oversight', element: <ContractManagementPage /> },
      { path: 'wallets-oversight', element: <WalletManagementPage /> },
      { path: 'verifications', element: <VerificationCenterPage /> },
      { path: 'approvals', element: <ApprovalCenterPage /> },
      { path: 'announcements-center', element: <AnnouncementsCenterPage /> },
      { path: 'bulk-operations', element: <BulkOperationsPage /> },
      { path: 'monitoring', element: <PlatformMonitoringPage /> },
      { path: 'audit-history', element: <AdministrativeAuditPage /> },
      { path: 'executive-analytics', element: <ExecutiveAnalyticsDashboardPage /> },
      { path: 'executive-analytics/reports', element: <ExecutiveAnalyticsReportsPage /> },
      { path: 'executive-analytics/center', element: <AnalyticsCenterPage /> },
      { path: 'executive-analytics/history', element: <ReportHistoryPage /> },
      { path: 'executive-analytics/scheduler', element: <ReportSchedulerPage /> },
      { path: 'executive-analytics/alerts', element: <ExecutiveAlertsPage /> },
      { path: 'executive-analytics/benchmarks', element: <KPIBenchmarkPage /> },
      { path: 'executive-analytics/customization', element: <DashboardCustomizationPage /> },
      { path: 'performance', element: <PerformanceDashboardPage /> },
      { path: 'performance/runtime', element: <RuntimeMonitoringPage /> },
      { path: 'performance/bundle', element: <BundleAnalysisPage /> },
      { path: 'performance/cache', element: <CacheManagementPage /> },
      { path: 'performance/database', element: <DatabaseOptimizationPage /> },
      { path: 'performance/load-testing', element: <LoadTestingPage /> },
      { path: 'performance/scalability', element: <ScalabilityPage /> },
      { path: 'performance/release-candidate', element: <ReleaseCandidatePage /> },
      { path: 'release', element: <ReleaseDashboardPage /> },
      { path: 'release/regression', element: <RegressionTestingPage /> },
      { path: 'release/security', element: <SecurityValidationPage /> },
      { path: 'release/deployment', element: <DeploymentCenterPage /> },
      { path: 'release/compliance', element: <ComplianceCenterPage /> },
      { path: 'release/disaster-recovery', element: <DisasterRecoveryPage /> },
      { path: 'release/go-live', element: <GoLiveReadinessPage /> },
      { path: 'release/acceptance', element: <ProductionAcceptancePage /> },
      { path: '*', element: <AdminDashboardPage /> },
    ],
  },

  // ─── Error Pages ───────────────────────────────────────────────────────────
  {
    path: '/500',
    element: <ServerErrorPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
