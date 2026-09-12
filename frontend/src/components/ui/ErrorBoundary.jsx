import { Component } from 'react';

/** Last-resort fallback so a render error never leaves a blank page. */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Render error', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 560, margin: '120px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Something went wrong.</h1>
          <p>Reload the page to try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
