import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { UserManagementTable } from '@components/admin/UserManagementTable';
import { AdminSearchBar } from '@components/admin/AdminSearchBar';
import { AdministrativeNotePanel } from '@components/admin/AdministrativeNotePanel';
import { RestrictionModal } from '@components/admin/RestrictionModal';
import { Users } from 'lucide-react';

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.searchUsers(search);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminService
      .searchUsers('')
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSuspend = async (userId, isCurrentlyActive) => {
    try {
      await adminService.toggleUserSuspension(userId, isCurrentlyActive);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleAddNote = async (targetUserId, noteText) => {
    try {
      await adminService.addUserNote({ targetUserId, noteText });
      alert('Administrative note saved');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            User, Worker & Client Administration
          </h1>
          <p className="text-slate-400 text-sm">Account search, suspensions, restriction tagging, and compliance notes</p>
        </div>
      </div>

      <AdminSearchBar
        value={search}
        onChange={setSearch}
        onSearch={fetchUsers}
        placeholder="Search users by name, email, or role..."
      />

      <UserManagementTable
        users={users}
        onToggleSuspend={handleToggleSuspend}
        onRestrict={(usr) => {
          setSelectedUser(usr);
          setIsRestrictModalOpen(true);
        }}
      />

      <AdministrativeNotePanel onAddNote={handleAddNote} />

      <RestrictionModal
        isOpen={isRestrictModalOpen}
        user={selectedUser}
        onClose={() => setIsRestrictModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
