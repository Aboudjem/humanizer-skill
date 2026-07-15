import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Manual sidebar for the Humanizer docs.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'installation',
    'usage',
    'voice-profiles',
    'patterns',
    'science',
    'cli',
  ],
};

export default sidebars;
