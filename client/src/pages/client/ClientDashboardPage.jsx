import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { StatCard } from '@components/ui/StatCard';
import { Card } from '@components/ui/Card';
import { Table } from '@components/ui/Table';
import { Tabs } from '@components/ui/Tabs';
import { StatusBadge } from '@components/display/StatusBadge';
import { ProfileCard } from '@components/display/ProfileCard';
import { EmptyState } from '@components/ui/EmptyState';
import { Button } from '@components/ui/Button';
import {
  FolderOpen,
  FileText,
  Wallet,
  MessageSquare,
  Bell,
  Settings,
  User,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export function ClientDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const sampleContracts = [
    { id: 'cnt_101', title: 'E-commerce React Frontend', worker: 'Alex Dev', amount: '$4,500', status: 'ACTIVE', date: '2026-08-01' },
    { id: 'cnt_102', title: 'Mobile App API Backend', worker: 'Sarah Code', amount: '$3,200', status: 'IN_ESCROW', date: '2026-07-28' },
    { id: 'cnt_103', title: 'UI/UX Redesign System', worker: 'Elena Design', amount: '$1,800', status: 'COMPLETED', date: '2026-07-15' },
  ];

  const overviewContent = (
    <div className="flex flex-col gap-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Contracts"
          value="4"
          icon={FileText}
          trend="up"
          trendValue="+12%"
          description="VS LAST MONTH"
        />
        <StatCard
          title="Total Escrow Held"
          value="$9,500"
          icon={Wallet}
          trend="up"
          trendValue="+25%"
          description="PROTECTED FUNDS"
        />
        <StatCard
          title="Completed Projects"
          value="18"
          icon={FolderOpen}
          trend="up"
          trendValue="+5"
          description="TOTAL DELIVERED"
        />
        <StatCard
          title="Pending Messages"
          value="3"
          icon={MessageSquare}
          description="UNREAD THREADS"
        />
      </div>

      {/* Recent Contracts Section */}
      <Card variant="elevated">
        <Card.Header>
          <div className="flex items-center justify-between w-full">
            <div>
              <Card.Title>Recent Digital Contracts</Card.Title>
              <p className="text-xs text-surface-600 mt-0.5">Overview of active escrow contract milestones.</p>
            </div>
            <Button variant="primary" size="xs" leftIcon={<Plus size={14} />}>
              Create Contract
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Contract Title</Table.Head>
                <Table.Head>Assigned Worker</Table.Head>
                <Table.Head>Escrow Value</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Created Date</Table.Head>
                <Table.Head>Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body columnsCount={6}>
              {sampleContracts.map((c) => (
                <Table.Row key={c.id}>
                  <Table.Cell className="font-semibold text-surface-900">{c.title}</Table.Cell>
                  <Table.Cell>{c.worker}</Table.Cell>
                  <Table.Cell className="font-mono font-medium text-primary-600">{c.amount}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={c.status} />
                  </Table.Cell>
                  <Table.Cell className="text-surface-500 text-xs">{c.date}</Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="xs" rightIcon={<ArrowUpRight size={12} />}>
                      Details
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: ShieldCheck, content: overviewContent },
    { id: 'projects', label: 'Projects', icon: FolderOpen, badge: '3', content: <EmptyState title="Projects Section" description="Phase 2 project management features placeholder." actionLabel="New Project" onAction={() => {}} /> },
    { id: 'contracts', label: 'Contracts', icon: FileText, badge: '4', content: <EmptyState title="Contracts Section" description="Phase 2 digital contract agreement list placeholder." actionLabel="New Contract" onAction={() => {}} /> },
    { id: 'wallet', label: 'Escrow Wallet', icon: Wallet, content: <EmptyState title="Wallet & Escrow" description="Phase 3 Razorpay payments and wallet management placeholder." actionLabel="Deposit Funds" onAction={() => {}} /> },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '2', content: <EmptyState title="Encrypted Messages" description="Phase 4 real-time messaging placeholder." /> },
    { id: 'notifications', label: 'Notifications', icon: Bell, content: <EmptyState title="System Notifications" description="Phase 4 notification feed placeholder." /> },
    { id: 'profile', label: 'Profile', icon: User, content: <ProfileCard user={user} /> },
    { id: 'settings', label: 'Settings', icon: Settings, content: <EmptyState title="Account Settings" description="Security and notification preferences placeholder." /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
