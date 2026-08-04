import { useState, useEffect } from 'react';
import { adminService } from '@services/admin.service';
import { ContractManagementTable } from '@components/admin/ContractManagementTable';
import { FileText } from 'lucide-react';

export function ContractManagementPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getContractsOversight();
      setContracts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleFlagContract = async (ctr) => {
    const reason = prompt(`Enter oversight flag reason for Contract #${ctr.contractNumber || ctr.id}:`);
    if (reason) {
      try {
        await adminService.updateContractOversight({
          contractId: ctr.id,
          isFlagged: true,
          flagReason: reason,
        });
        alert('Contract flagged for oversight');
        fetchContracts();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-sky-400" />
          Contract Oversight & Administrative Intervention
        </h1>
        <p className="text-slate-400 text-sm">Monitor platform digital contracts, status notes, and oversight flags</p>
      </div>

      <ContractManagementTable contracts={contracts} onFlagContract={handleFlagContract} />
    </div>
  );
}
