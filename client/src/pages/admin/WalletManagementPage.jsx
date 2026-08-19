import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { WalletManagementTable } from '@components/admin/WalletManagementTable';
import { Wallet } from 'lucide-react';

export function WalletManagementPage() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const data = await adminService.getWalletsOversight();
      setWallets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleToggleFreeze = async (walletId, isCurrentlyFrozen) => {
    const reason = !isCurrentlyFrozen ? prompt('Enter reason for freezing wallet:') : 'Administrative unfreeze';
    if (!isCurrentlyFrozen && !reason) return;

    try {
      await adminService.updateWalletOversight({
        walletId,
        isFrozen: !isCurrentlyFrozen,
        freezeReason: reason,
      });
      fetchWallets();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Escrow Wallet Inspection & Freeze Control
        </h1>
        <p className="text-slate-400 text-sm">Escrow balance inspection, hold monitoring, and administrative wallet freezes</p>
      </div>

      <WalletManagementTable wallets={wallets} onToggleFreeze={handleToggleFreeze} />
    </div>
  );
}
