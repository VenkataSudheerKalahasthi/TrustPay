import { useState, useEffect } from 'react';
import { FolderOpen, Plus, Search } from 'lucide-react';
import { fileService } from '@services/file.service';
import { FileCard } from '@components/file/FileCard';
import { ShareLinkModal } from '@components/file/ShareLinkModal';
import { Button } from '@components/ui/Button';

export function FileManagerPage() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [storageStats, setStorageStats] = useState(null);
  const [activeShareFileId, setActiveShareFileId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    async function loadFileData() {
      try {
        const [filesRes, statsRes] = await Promise.all([
          fileService.getFiles({ query }),
          fileService.getStorageStats(),
        ]);
        setFiles(filesRes.files || []);
        setStorageStats(statsRes.storageStats || null);
      } catch (err) {
        console.error('Failed to load files', err);
      }
    }
    loadFileData();
  }, [query]);

  const handleUploadMock = async (e) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    setUploading(true);
    try {
      const created = await fileService.createFileAsset({
        name: fileName,
        mimeType: 'application/pdf',
        sizeBytes: 204800,
        checksum: 'sha256_mock_' + Date.now().toString(16),
        storagePath: `uploads/${Date.now()}_${fileName}`,
      });
      setFiles((prev) => [created, ...prev]);
      setFileName('');
    } catch (err) {
      console.error('Failed to upload file', err);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      await fileService.toggleFavorite(id, isFavorite);
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isFavorite } : f)));
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
            <FolderOpen size={20} className="text-primary-400" />
            <span>Enterprise File Manager & Supabase Storage</span>
          </h1>
          <p className="text-xs text-surface-400">
            SHA-256 verified assets, version control, signed download URLs, and password-protected share links.
          </p>
        </div>

        {storageStats && (
          <div className="text-3xs font-mono bg-surface-900 border border-surface-800 rounded-xl px-3 py-2 text-surface-400">
            Storage Bucket: <span className="text-primary-400 font-bold">{storageStats.bucketName}</span> ({storageStats.status})
          </div>
        )}
      </div>

      {/* Upload & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <form onSubmit={handleUploadMock} className="md:col-span-2 p-3 rounded-2xl bg-surface-900 border border-surface-800 flex gap-2">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Register File Asset Name (e.g. Master_Agreement_v1.pdf)"
            className="flex-1 px-3 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500"
          />
          <Button size="sm" variant="primary" type="submit" isLoading={uploading} leftIcon={<Plus size={14} />}>
            Upload Asset
          </Button>
        </form>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by file name..."
            className="w-full pl-9 pr-3 py-3 rounded-2xl bg-surface-900 border border-surface-800 text-xs text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onShare={(id) => setActiveShareFileId(id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      <ShareLinkModal
        isOpen={!!activeShareFileId}
        onClose={() => setActiveShareFileId(null)}
        onGenerateShare={(data) => fileService.createShareLink(activeShareFileId, data)}
      />
    </div>
  );
}
