import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collaborationService } from '@services/collaboration.service';
import { chatService } from '@services/chat.service';
import { useChatSocket } from '@hooks/useChatSocket';
import { useAuth } from '@hooks/useAuth';
import { PageLoader } from '@components/error/PageLoader';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Avatar } from '@components/ui/Avatar';
import {
  MessageSquare,
  FileSpreadsheet,
  FileSignature,
  Wallet,
  CheckSquare,
  Award,
  Send,
  Lock,
  CheckCircle2,
  DollarSign,
  PenTool,
} from 'lucide-react';

export function CollaborationWorkspacePage() {
  const { id: workspaceId } = useParams();
  const { user: currentUser } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'planning' | 'contract' | 'escrow' | 'execution' | 'certificate'

  // Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const conversationId = workspace?.conversationId;
  const { socket } = useChatSocket(conversationId);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleMessageReceived = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on('message:received', handleMessageReceived);

    return () => {
      socket.off('message:received', handleMessageReceived);
    };
  }, [socket, conversationId]);

  // Planning Board State
  const [planningBoard, setPlanningBoard] = useState({
    scope: '',
    budget: '',
    timeline: '',
    revisionPolicy: '',
    dueDates: '',
    notes: '',
    deliverables: [],
    milestones: [],
  });
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // E-Signature State
  const [signatureType] = useState('TYPE'); // 'DRAW' | 'TYPE' | 'UPLOAD'
  const [typedSignature, setTypedSignature] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  // Escrow Funding State
  const [isFunding, setIsFunding] = useState(false);

  // Completion State
  const [isApproving, setIsApproving] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    fetchWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    try {
      setIsLoading(true);
      const ws = await collaborationService.getWorkspaceById(workspaceId);
      setWorkspace(ws);

      if (ws.planningBoard) {
        let parsedDeliv = [];
        let parsedMiles = [];
        try {
          parsedDeliv = typeof ws.planningBoard.deliverables === 'string' ? JSON.parse(ws.planningBoard.deliverables) : ws.planningBoard.deliverables || [];
          parsedMiles = typeof ws.planningBoard.milestones === 'string' ? JSON.parse(ws.planningBoard.milestones) : ws.planningBoard.milestones || [];
        } catch {
          parsedDeliv = [];
          parsedMiles = [];
        }

        setPlanningBoard({
          scope: ws.planningBoard.scope || '',
          budget: ws.planningBoard.budget || ws.request?.budget || 0,
          timeline: ws.planningBoard.timeline || '',
          revisionPolicy: ws.planningBoard.revisionPolicy || '',
          dueDates: ws.planningBoard.dueDates || '',
          notes: ws.planningBoard.notes || '',
          deliverables: parsedDeliv,
          milestones: parsedMiles,
        });
      }

      if (ws.conversationId) {
        fetchChatMessages(ws.conversationId);
      }

      if (ws.status === 'COMPLETED') {
        fetchCertificate();
      }
    } catch (err) {
      console.error('Failed to fetch workspace', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMessages = async (convId) => {
    try {
      const res = await chatService.getMessages(convId);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load chat messages', err);
    }
  };

  const fetchCertificate = async () => {
    try {
      const cert = await collaborationService.getCertificate(workspaceId);
      setCertificateData(cert);
    } catch (err) {
      console.error('Certificate not ready', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !workspace?.conversationId) return;

    try {
      const newMsg = await chatService.sendMessage({
        conversationId: workspace.conversationId,
        content: chatInput,
        messageType: 'TEXT',
      });
      setMessages((prev) => [...prev, newMsg]);
      setChatInput('');
    } catch (err) {
      console.error('Message failed', err);
    }
  };

  const handleSavePlanningBoard = async (agree = false) => {
    try {
      setIsSavingPlan(true);
      const updated = await collaborationService.updatePlanningBoard(workspaceId, {
        ...planningBoard,
        agree,
      });
      setWorkspace(updated);
      alert(agree ? 'You agreed to the Planning Board!' : 'Planning board updated.');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update plan');
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleSignContract = async () => {
    if (!typedSignature && signatureType === 'TYPE') {
      alert('Please enter your full legal name as digital signature.');
      return;
    }

    try {
      setIsSigning(true);
      const updated = await collaborationService.signContract(workspaceId, signatureType, typedSignature || 'Digitally Signed');
      setWorkspace(updated);
      alert('Contract digitally signed!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Signing failed');
    } finally {
      setIsSigning(false);
    }
  };

  const handleFundEscrow = async () => {
    try {
      setIsFunding(true);
      const updated = await collaborationService.fundEscrow(workspaceId);
      setWorkspace(updated);
      alert('Escrow funded successfully from your wallet!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Funding failed');
    } finally {
      setIsFunding(false);
    }
  };

  const handleApproveCompletion = async () => {
    if (!window.confirm('Are you sure you want to approve final delivery and release Escrow funds to the worker?')) {
      return;
    }

    try {
      setIsApproving(true);
      const res = await collaborationService.approveFinalDelivery(workspaceId);
      setWorkspace(res.workspace);
      setCertificateData(res.certificate);
      alert('Final delivery approved! Escrow funds released and Completion Certificate generated.');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Approval failed');
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) return <PageLoader message="Loading Private Workspace..." />;
  if (!workspace) return <div className="p-8 text-center text-surface-400">Workspace not found</div>;

  const clientUser = workspace.clientProfile?.user || {};
  const workerUser = workspace.workerProfile?.user || {};

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Workspace Top Header Bar */}
        <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-2 border-primary-500/30">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span className="text-2xs font-mono font-bold px-2.5 py-1 rounded-lg bg-surface-800 text-primary-300 border border-surface-700">
                {workspace.workspaceNumber}
              </span>
              <Badge
                variant={
                  workspace.status === 'COMPLETED'
                    ? 'success'
                    : workspace.status === 'CONTRACT_LOCKED' || workspace.status === 'FUNDED'
                    ? 'primary'
                    : 'warning'
                }
                size="sm"
              >
                {workspace.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold font-display text-surface-50">
              {workspace.request?.projectTitle || workspace.project?.title || 'Collaboration Workspace'}
            </h1>
            <div className="flex items-center gap-4 text-xs text-surface-400">
              <span>Client: <strong className="text-surface-200">{clientUser.firstName} {clientUser.lastName}</strong></span>
              <span>Specialist: <strong className="text-surface-200">{workerUser.firstName} {workerUser.lastName}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-surface-900 border border-surface-800 flex flex-col items-end">
              <span className="text-2xs text-surface-400">Escrow Budget</span>
              <span className="text-lg font-bold text-emerald-400 flex items-center">
                <DollarSign size={16} /> ₹{workspace.planningBoard?.budget || workspace.request?.budget || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-surface-800 pb-2">
          {[
            { id: 'chat', label: '1. Private Chat & Files', icon: MessageSquare },
            { id: 'planning', label: '2. Planning Board', icon: FileSpreadsheet },
            { id: 'contract', label: '3. Digital Contract & Sign', icon: FileSignature },
            { id: 'escrow', label: '4. Escrow Funding', icon: Wallet },
            { id: 'execution', label: '5. Execution & Deliverables', icon: CheckSquare },
            { id: 'certificate', label: '6. Certificate & Documents', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-surface-900 text-surface-300 hover:text-surface-100 hover:bg-surface-800'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PRIVATE CHAT */}
        {activeTab === 'chat' && (
          <div className="glass-card flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-surface-800 bg-surface-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={workerUser.firstName} src={workerUser.avatar} size="sm" status="online" />
                <div>
                  <h3 className="text-xs font-bold text-surface-100">{workerUser.firstName} {workerUser.lastName}</h3>
                  <span className="text-2xs text-emerald-400">Direct Workspace Real-time Sync</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.length === 0 ? (
                <div className="my-auto text-center text-xs text-surface-500">
                  Private chat room created. Send a message to start collaboration.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderUserId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-md ${
                        isMe ? 'ml-auto items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-xs ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-br-none'
                            : 'bg-surface-800 text-surface-100 rounded-bl-none border border-surface-700/60'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-2xs text-surface-500 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-800 bg-surface-950/80 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message or project note..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={14} />}>
                Send
              </Button>
            </form>
          </div>
        )}

        {/* TAB 2: PLANNING BOARD */}
        {activeTab === 'planning' && (
          <div className="glass-card p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-surface-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-surface-50 flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-primary-400" />
                  Collaborative Project Planning Board
                </h2>
                <p className="text-xs text-surface-400">
                  Define scope, milestones, revision policy, and budget together in real time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={workspace.planningBoard?.clientAgreed ? 'success' : 'neutral'} size="sm">
                  Client: {workspace.planningBoard?.clientAgreed ? 'Agreed' : 'Pending'}
                </Badge>
                <Badge variant={workspace.planningBoard?.workerAgreed ? 'success' : 'neutral'} size="sm">
                  Worker: {workspace.planningBoard?.workerAgreed ? 'Agreed' : 'Pending'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200">Scope of Work</label>
                <textarea
                  rows={4}
                  value={planningBoard.scope}
                  onChange={(e) => setPlanningBoard((p) => ({ ...p, scope: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200">Revision Policy & Guarantee</label>
                <textarea
                  rows={4}
                  value={planningBoard.revisionPolicy}
                  onChange={(e) => setPlanningBoard((p) => ({ ...p, revisionPolicy: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200">Agreed Budget (₹)</label>
                <input
                  type="number"
                  value={planningBoard.budget}
                  onChange={(e) => setPlanningBoard((p) => ({ ...p, budget: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200">Timeline</label>
                <input
                  type="text"
                  value={planningBoard.timeline}
                  onChange={(e) => setPlanningBoard((p) => ({ ...p, timeline: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-surface-200">Target Due Date</label>
                <input
                  type="text"
                  value={planningBoard.dueDates}
                  onChange={(e) => setPlanningBoard((p) => ({ ...p, dueDates: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-between">
              <span className="text-xs text-surface-300">
                Once both Client and Specialist agree, an Enterprise Digital Contract will automatically generate.
              </span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => handleSavePlanningBoard(false)} isLoading={isSavingPlan}>
                  Save Draft
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleSavePlanningBoard(true)} isLoading={isSavingPlan} className="shadow-glow">
                  Agree & Lock Plan
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIGITAL CONTRACT & SIGNATURE */}
        {activeTab === 'contract' && (
          <div className="glass-card p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-surface-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-surface-50 flex items-center gap-2">
                  <FileSignature size={20} className="text-primary-400" />
                  Enterprise Digital Contract
                </h2>
                <p className="text-xs text-surface-400">
                  Contract Number: {workspace.contract?.contractNumber || 'Generating upon agreement...'}
                </p>
              </div>
              <Badge variant={workspace.status === 'CONTRACT_LOCKED' || workspace.contract?.status === 'ACCEPTED' ? 'success' : 'warning'} size="md">
                {workspace.contract?.status === 'ACCEPTED' ? '✅ CONTRACT LOCKED' : 'DRAFT / PENDING SIGNATURES'}
              </Badge>
            </div>

            {workspace.contract ? (
              <div className="flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-surface-950 border border-surface-800 text-xs text-surface-200 flex flex-col gap-4 font-mono leading-relaxed max-h-96 overflow-y-auto">
                  <h3 className="text-sm font-bold text-surface-50 font-display border-b border-surface-800 pb-2">
                    {workspace.contract.title}
                  </h3>
                  <p><strong>SCOPE OF WORK:</strong> {workspace.contract.scopeOfWork}</p>
                  <p><strong>PAYMENT TERMS:</strong> {workspace.contract.paymentTermsText}</p>
                  <p><strong>TERMS & CONDITIONS:</strong> {workspace.contract.termsAndConditions}</p>
                </div>

                {/* Signatures Status Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(() => {
                    const clientSig = workspace.contract.signatures?.find((s) => s.signerRole === 'CLIENT');
                    const workerSig = workspace.contract.signatures?.find((s) => s.signerRole === 'WORKER');
                    return (
                      <>
                        <div className="p-4 rounded-xl bg-surface-950 border border-surface-800 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-surface-200">Client Signature</span>
                            <Badge variant={clientSig?.signatureStatus === 'SIGNED' ? 'success' : 'neutral'} size="sm">
                              {clientSig?.signatureStatus === 'SIGNED' ? 'SIGNED' : 'PENDING'}
                            </Badge>
                          </div>
                          <p className="text-2xs text-surface-400 font-mono">
                            Signer: {clientUser.firstName} {clientUser.lastName}
                          </p>
                          {clientSig?.signatureTimestamp && (
                            <span className="text-3xs text-emerald-400 font-mono">
                              Signed: {new Date(clientSig.signatureTimestamp).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="p-4 rounded-xl bg-surface-950 border border-surface-800 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-surface-200">Specialist Signature</span>
                            <Badge variant={workerSig?.signatureStatus === 'SIGNED' ? 'success' : 'neutral'} size="sm">
                              {workerSig?.signatureStatus === 'SIGNED' ? 'SIGNED' : 'PENDING'}
                            </Badge>
                          </div>
                          <p className="text-2xs text-surface-400 font-mono">
                            Signer: {workerUser.firstName} {workerUser.lastName}
                          </p>
                          {workerSig?.signatureTimestamp && (
                            <span className="text-3xs text-emerald-400 font-mono">
                              Signed: {new Date(workerSig.signatureTimestamp).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* E-signature Input */}
                {workspace.contract?.status !== 'ACCEPTED' && (
                  <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-surface-50 font-display flex items-center gap-2">
                      <PenTool size={16} className="text-primary-400" />
                      Electronic Signature Pad
                    </h3>

                    <div className="flex flex-col gap-3">
                      <label className="text-2xs text-surface-400 uppercase font-semibold">Type Full Legal Signature Name</label>
                      <input
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder={`e.g. ${currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Full Legal Name'}`}
                        className="px-4 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-sm text-surface-100 font-display focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSignContract}
                        isLoading={isSigning}
                        leftIcon={<Lock size={16} />}
                        className="shadow-glow"
                      >
                        Digitally Sign & Lock Contract
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-surface-400">
                Please complete and agree to the Planning Board to generate the Enterprise Digital Contract.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ESCROW FUNDING */}
        {activeTab === 'escrow' && (
          <div className="glass-card p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-surface-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-surface-50 flex items-center gap-2">
                  <Wallet size={20} className="text-primary-400" />
                  Escrow Funding & Wallet Protection
                </h2>
                <p className="text-xs text-surface-400">
                  Client deposits budget into Escrow. Funds are safely held until project completion.
                </p>
              </div>
              <Badge variant={workspace.status === 'FUNDED' || workspace.status === 'IN_PROGRESS' || workspace.status === 'COMPLETED' ? 'success' : 'warning'} size="md">
                {workspace.status === 'FUNDED' || workspace.status === 'IN_PROGRESS' || workspace.status === 'COMPLETED' ? 'FUNDED & SECURED' : 'AWAITING DEPOSIT'}
              </Badge>
            </div>

            <div className="p-8 rounded-2xl bg-surface-950 border border-surface-800 flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign size={40} />
              </div>
              <h3 className="text-xl font-bold text-surface-50 font-display">
                Escrow Amount: ₹{workspace.planningBoard?.budget || workspace.request?.budget || 0}
              </h3>
              <p className="text-xs text-surface-400 max-w-md">
                Specialist can view funding status. Specialist cannot withdraw funds until final client approval.
              </p>

              <Button
                variant="primary"
                size="lg"
                onClick={handleFundEscrow}
                isLoading={isFunding}
                leftIcon={<Wallet size={18} />}
                className="shadow-glow px-8 mt-2"
              >
                Deposit & Fund Escrow from Wallet
              </Button>
            </div>
          </div>
        )}

        {/* TAB 5: EXECUTION & DELIVERABLES */}
        {activeTab === 'execution' && (
          <div className="glass-card p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-surface-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-surface-50 flex items-center gap-2">
                  <CheckSquare size={20} className="text-primary-400" />
                  Project Execution & Milestone Review
                </h2>
                <p className="text-xs text-surface-400">
                  Track milestone progress, submit deliverables, and approve project phases.
                </p>
              </div>
            </div>

            {workspace.project?.milestones ? (
              <div className="flex flex-col gap-4">
                {workspace.project.milestones.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-surface-100">{m.title}</h4>
                      <p className="text-xs text-surface-400">{m.description || 'Phase milestone'}</p>
                    </div>
                    <Badge variant={m.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                      {m.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-surface-400">
                Milestones active upon contract lock.
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CERTIFICATE & DOCUMENTS */}
        {activeTab === 'certificate' && (
          <div className="glass-card p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-surface-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-surface-50 flex items-center gap-2">
                  <Award size={20} className="text-primary-400" />
                  Completion Certificate & Invoices
                </h2>
                <p className="text-xs text-surface-400">
                  Generated documents upon client final delivery approval and escrow release.
                </p>
              </div>
              {workspace.status !== 'COMPLETED' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleApproveCompletion}
                  isLoading={isApproving}
                  leftIcon={<CheckCircle2 size={18} />}
                  className="shadow-glow"
                >
                  Approve Final Delivery & Release Escrow
                </Button>
              )}
            </div>

            {certificateData ? (
              <div className="p-8 rounded-2xl bg-surface-950 border-2 border-emerald-500/40 flex flex-col gap-6 text-center items-center shadow-glow">
                <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400">
                  <Award size={48} />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-2xs font-mono text-emerald-400 font-bold uppercase">OFFICIAL TRUSTPAY CERTIFICATE</span>
                  <h3 className="text-2xl font-bold font-display text-surface-50">{certificateData.projectTitle}</h3>
                  <p className="text-xs text-surface-300">
                    Awarded for successful project completion between <strong>{certificateData.clientName}</strong> and <strong>{certificateData.workerName}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-900 border border-surface-800 text-2xs font-mono text-surface-400">
                  Verification Code: {certificateData.certificateNumber} | Cryptographic Hash: {certificateData.verificationHash}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-surface-400">
                Click "Approve Final Delivery & Release Escrow" above to finalize the project, release funds to the worker wallet, and generate official invoices and completion certificates.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
