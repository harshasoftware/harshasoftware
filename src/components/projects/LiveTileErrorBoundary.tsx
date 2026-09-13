import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/** If a live visual (or its lazy chunk) throws, render nothing so the poster underneath stays. */
export class LiveTileErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(`[LiveTile:${this.props.label}] falling back to poster`, error, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
