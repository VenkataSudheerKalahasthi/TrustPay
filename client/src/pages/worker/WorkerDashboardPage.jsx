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
  ArrowUpRight,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

export function WorkerDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const sampleWork = [
    { id: 'cnt_201', title: 'Fintech Dashboard Implementation', client: 'Enterprise Client A', amount: '$3,800', status: 'ACTIVE', progress: '75%' },
    { id: 'cnt_202', title: 'Node.js Microservices Refactoring', client: 'TechCorp LLC', amount: '$2,500', status: 'IN_ESCROW', progress: '30%' },
    { id: 'cnt_203', title: 'Database Optimization Sprint', client: 'Startup Inc', amount: '$1,200', status: 'COMPLETED', progress: '100%' },
  ];

  const overviewContent = (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earnings"
          value="$14,200"
          icon={TrendingUp}
          trend="up"
          trendValue="+18%"
          description="LIFETIME RELEASED"
        />
        <StatCard
          title="Escrow Pending"
          value="$6,300"
          icon={Wallet}
          description="HELD IN ESCROW"
        />
        <StatCard
          title="Active Projects"
          value="3"
          icon={FolderOpen}
          description="IN PROGRESS"
        />
        <StatCard
          title="Completed Milestones"
          value="24"
          icon={CheckCircle}
          trend="up"
          trendValue="+4"
          description="VERIFIED DELIVERABLES"
        />
      </div>

      <Card variant="elevated">
        <Card.Header>
          <div className="flex items-center justify-between w-full">
            <div>
              <Card.Title>Assigned Work & Milestone Progress</Card.Title>
              <p className="text-xs text-surface-600 mt-0.5">Track your active contracts and escrow releases.</p>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Project Title</Table.Head>
                <Table.Head>Client</Table.Head>
                <Table.Head>Milestone Value</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Completion</Table.Head>
                <Table.Head>Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body columnsCount={6}>
              {sampleWork.map((w) => (
                <Table.Row key={w.id}>
                  <Table.Cell className="font-semibold text-surface-900">{w.title}</Table.Cell>
                  <Table.Cell>{w.client}</Table.Cell>
                  <Table.Cell className="font-mono font-medium text-success-600">{w.amount}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={w.status} />
                  </Table.Cell>
                  <Table.Cell className="text-xs font-semibold text-primary-600">{w.progress}</Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="xs" rightIcon={<ArrowUpRight size={12} />}>
                      View Contract
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
    { id: 'overview', label: 'Overview', icon: CheckCircle, content: overviewContent },
    { id: 'projects', label: 'My Projects', icon: FolderOpen, badge: '3', content: <EmptyState title="Worker Projects" description="Phase 2 active proposals & contracts list." /> },
    { id: 'contracts', label: 'Contracts', icon: FileText, badge: '3', content: <EmptyState title="Digital Agreements" description="Phase 2 signed agreements & milestones." /> },
    { id: 'wallet', label: 'Earnings & Wallet', icon: Wallet, content: <EmptyState title="Earnings Portal" description="Phase 3 wallet withdrawal & payout history." /> },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '1', content: <EmptyState title="Client Chat" description="Phase 4 worker-client messaging." /> },
    { id: 'notifications', label: 'Notifications', icon: Bell, content: <EmptyState title="Milestone Alerts" description="Phase 4 notifications placeholder." /> },
    { id: 'profile', label: 'Worker Profile', icon: User, content: <ProfileCard user={user} /> },
    { id: 'settings', label: 'Settings', icon: Settings, content: <EmptyState title="Worker Settings" description="Payment & profile preferences." /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
