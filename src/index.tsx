import { createRoot } from 'react-dom/client';

import App from './app/App';

const editorConfig = {
  userId: 'starterkit-ai-editor-user'
  // baseURL: '/assets/',
  // license: 'YOUR_LICENSE_KEY',
};

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
createRoot(container).render(<App config={editorConfig} />);
