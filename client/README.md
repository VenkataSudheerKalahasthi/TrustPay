# TrustPay Client Frontend Architecture (v1.2 Refinement)

The TrustPay frontend application is built with **React 19 + Vite + Tailwind CSS + Framer Motion**, following enterprise single-responsibility architecture and feature-based modularity.

---

## 1. Theme Architecture (`ThemeProvider`)

The frontend relies on a centralized **`ThemeProvider`** located in `@contexts/ThemeContext.jsx`.

### Key Features
- **Dark/Light Mode Persistence**: Automatically syncs theme preference with `localStorage` and HTML `dark` class.
- **Centralized Design System Tokens (`DESIGN_TOKENS`)**: Exposes tokens for colors (primary, surface, success, warning, danger), typography, border radius, shadows, and spacing.
- **Hook Integration**: Access via `useTheme()` hook.

### Usage Example
```javascript
import { useTheme } from '@hooks/useTheme';

function MyComponent() {
  const { theme, isDark, toggleTheme, tokens } = useTheme();

  return (
    <div style={{ color: tokens.colors.primary[500] }}>
      <p>Current Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

---

## 2. Reusable Page Header (`PageHeader`)

Located in `@components/common/PageHeader.jsx`, the **`PageHeader`** component provides a standardized, responsive page banner across all role portals (`CLIENT`, `WORKER`, `ADMIN`).

### Supported Props
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string \| ReactNode` | Primary page heading |
| `subtitle` | `string \| ReactNode` | Optional subtitle or description text |
| `breadcrumbs` | `Array<{ label, href }>` | Optional breadcrumb path navigation items |
| `actions` | `ReactNode` | Action buttons slot (e.g. "Create Contract", "Export") |
| `badge` | `ReactNode` | Optional status badge or role indicator |
| `icon` | `LucideIcon` | Optional heading icon |

### Usage Example
```javascript
import { PageHeader } from '@components/common/PageHeader';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Plus, FolderOpen } from 'lucide-react';

function ProjectsPage() {
  return (
    <PageHeader
      title="Project Workspaces"
      subtitle="Manage active contracts and milestone deliverables."
      icon={FolderOpen}
      badge={<Badge variant="primary">ACTIVE</Badge>}
      actions={
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
          New Project
        </Button>
      }
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard/client' },
        { label: 'Projects' }
      ]}
    />
  );
}
```
