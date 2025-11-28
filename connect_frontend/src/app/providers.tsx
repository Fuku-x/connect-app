'use client';

// React 19との互換性パッチ - 最初にインポート
import '@ant-design/v5-patch-for-react-19';

import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
