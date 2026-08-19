import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@components/ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log exception in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-card flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-3xl bg-danger-500/15 border border-danger-200 text-danger-600 mb-6 shadow">
            <AlertTriangle size={48} />
          </div>
          <h1 className="text-2xl font-bold font-display text-surface-900">
            An Unexpected System Error Occurred
          </h1>
          <p className="text-sm text-surface-600 mt-2 max-w-md">
            {this.state.error?.message || 'The application encountered an unexpected runtime issue.'}
          </p>
          <Button
            variant="primary"
            size="md"
            className="mt-6"
            leftIcon={<RotateCcw size={16} />}
            onClick={this.handleReset}
          >
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

