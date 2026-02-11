import React, { Component, ErrorInfo, ReactNode } from 'react';

// Define Props interface with children as optional to prevent mismatch errors in JSX consumers 
// (index.tsx and App.tsx) where children were reported as missing.
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fix: Use React.Component explicitly and add a constructor with super(props) to ensure 
// that both 'props' and 'state' are correctly recognized by the TypeScript compiler 
// as belonging to the component instance.
class ErrorBoundary extends React.Component<Props, State> {
  private readonly fallbackChildren: ReactNode;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
    this.fallbackChildren = props.children ?? null;
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // Correctly accessing this.state which is now properly recognized by the compiler.
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-xl border border-red-500">
            <h2 className="text-xl font-bold text-red-500 mb-4">System Critical Error</h2>
            <div className="bg-black/50 p-4 rounded mb-4 overflow-auto text-sm font-mono text-gray-300 max-h-60">
              {this.state.error?.toString()}
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The application encountered a runtime error. This is often caused by missing environment variables, network issues, or script loading failures.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-bold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    // Accessing this.props.children is now safe as it is inherited from React.Component and typed in Props.
    return this.props.children;
  }
}

export default ErrorBoundary;
