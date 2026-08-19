import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collaborationService } from '@services/collaboration.service';
import { PageLoader } from '@components/error/PageLoader';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Avatar } from '@components/ui/Avatar';
import {
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FolderKanban,
  Sparkles,
} from 'lucide-react';

export function CollaborationCenterPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workspaces'); // 'workspaces' | 'requests'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [reqData, wsData] = await Promise.all([
        collaborationService.getRequests(),
        collaborationService.getWorkspaces(),
      ]);
      setRequests(reqData || []);
      setWorkspaces(wsData || []);
    } catch (err) {
      console.error('Failed to load collaboration center data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      setActionLoadingId(requestId);
      const res = await collaborationService.respondToRequest(requestId, action);
      if (action === 'ACCEPT' && res.data?.id) {
        navigate(`/collaboration/workspace/${res.data.id}`);
      } else {
        await fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) return <PageLoader message="Loading Collaboration Workspace Center..." />;

  return (
    <div className="min-h-screen bg-card text-surface-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary-50 text-primary-600 border border-primary-100">
                <FolderKanban size={22} />
              </span>
              <h1 className="text-2xl font-bold font-display text-surface-900">Project Collaboration Workspaces</h1>
            </div>
            <p className="text-xs text-surface-600 mt-1">
              Private workspaces for Client ↔ Worker communication, real-time planning, digital contracts, and escrow execution.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-card border border-surface-200">
            <button
              onClick={() => setActiveTab('workspaces')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'workspaces'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-surface-600 hover:text-surface-800'
              }`}
            >
              Active Workspaces ({workspaces.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-surface-600 hover:text-surface-800'
              }`}
            >
              Collaboration Requests ({requests.length})
            </button>
          </div>
        </div>

        {/* WORKSPACES TAB */}
        {activeTab === 'workspaces' && (
          <div className="flex flex-col gap-4">
            {workspaces.length === 0 ? (
              <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-3">
                <Sparkles size={40} className="text-primary-600/60" />
                <h3 className="text-base font-bold text-surface-800 font-display">No Active Workspaces Yet</h3>
                <p className="text-xs text-surface-600 max-w-md">
                  Workspaces are created automatically when a worker accepts a collaboration request from a client.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaces.map((ws) => {
                  const clientUser = ws.clientProfile?.user || {};
                  const workerUser = ws.workerProfile?.user || {};
                  return (
                    <div
                      key={ws.id}
                      className="glass-card p-6 flex flex-col justify-between gap-5 hover:border-primary-600/40 transition-all group"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xs font-mono font-bold text-surface-600 uppercase tracking-wider">
                            {ws.workspaceNumber}
                          </span>
                          <Badge
                            variant={
                              ws.status === 'COMPLETED'
                                ? 'success'
                                : ws.status === 'CONTRACT_LOCKED' || ws.status === 'FUNDED'
                                ? 'primary'
                                : 'warning'
                            }
                            size="sm"
                          >
                            {ws.status}
                          </Badge>
                        </div>

                        <h3 className="text-base font-bold text-surface-900 font-display group-hover:text-primary-700 transition-colors">
                          {ws.request?.projectTitle || ws.project?.title || 'Collaboration Workspace'}
                        </h3>

                        <div className="flex items-center gap-6 py-2 border-y border-surface-200/60 text-xs">
                          <div className="flex items-center gap-2">
                            <Avatar name={clientUser.firstName} src={clientUser.avatar} size="xs" />
                            <div>
                              <span className="text-2xs text-surface-600 block">Client</span>
                              <span className="font-semibold text-surface-800">
                                {clientUser.firstName} {clientUser.lastName}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar name={workerUser.firstName} src={workerUser.avatar} size="xs" />
                            <div>
                              <span className="text-2xs text-surface-600 block">Specialist</span>
                              <span className="font-semibold text-surface-800">
                                {workerUser.firstName} {workerUser.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                          <DollarSign size={16} />
                          ₹{ws.planningBoard?.budget || ws.request?.budget || 0}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/collaboration/workspace/${ws.id}`)}
                          rightIcon={<ArrowRight size={14} />}
                        >
                          Open Workspace
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div className="flex flex-col gap-4">
            {requests.length === 0 ? (
              <div className="glass-card p-12 text-center text-xs text-surface-600">
                No collaboration requests found.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {requests.map((req) => {
                  const clientUser = req.clientProfile?.user || {};
                  const workerUser = req.workerProfile?.user || {};
                  const isPending = req.status === 'PENDING';

                  return (
                    <div key={req.id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex flex-col gap-2 max-w-2xl">
                        <div className="flex items-center gap-3">
                          <Badge variant={isPending ? 'warning' : req.status === 'ACCEPTED' ? 'success' : 'danger'} size="sm">
                            {req.status}
                          </Badge>
                          <span className="text-2xs font-mono text-surface-600">{req.requestNumber}</span>
                        </div>
                        <h3 className="text-base font-bold font-display text-surface-900">{req.projectTitle}</h3>
                        <p className="text-xs text-surface-700 line-clamp-2">{req.projectDescription}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-surface-600 mt-2">
                          <span className="flex items-center gap-1 font-semibold text-emerald-400">
                            <DollarSign size={14} /> ₹{req.budget}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {req.estimatedDuration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} /> Client: {clientUser.firstName} {clientUser.lastName}
                          </span>
                          <span className="flex items-center gap-1">
                            Specialist: {workerUser.firstName} {workerUser.lastName}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        {isPending && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRespond(req.id, 'REJECT')}
                              isLoading={actionLoadingId === req.id}
                              leftIcon={<XCircle size={14} />}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleRespond(req.id, 'ACCEPT')}
                              isLoading={actionLoadingId === req.id}
                              leftIcon={<CheckCircle2 size={14} />}
                              className="shadow"
                            >
                              Accept & Create Workspace
                            </Button>
                          </>
                        )}
                        {req.workspace && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/collaboration/workspace/${req.workspace.id}`)}
                            rightIcon={<ArrowRight size={14} />}
                          >
                            Go to Workspace
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

