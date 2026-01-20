import React from 'react';

/**
 * Page-level Error Boundary
 * Catches errors in a specific page/component tree
 * Provides better error isolation than a single global boundary
 */
class PageErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('Page Error Boundary caught an error:', error, errorInfo);
        }

        // Update state with error details
        this.setState({
            error,
            errorInfo
        });

        // TODO: Send error to logging service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            const { fallback, pageName } = this.props;

            // Use custom fallback if provided
            if (fallback) {
                return fallback({
                    error: this.state.error,
                    errorInfo: this.state.errorInfo,
                    resetError: this.handleReset
                });
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <h1 className="mt-4 text-xl font-semibold text-center text-gray-900">
                            {pageName ? `Error in ${pageName}` : 'Something went wrong'}
                        </h1>

                        <p className="mt-2 text-sm text-center text-gray-600">
                            We encountered an error while loading this page. Please try again.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Error Details
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default PageErrorBoundary;
