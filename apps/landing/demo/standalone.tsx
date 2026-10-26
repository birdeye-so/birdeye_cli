import { createRoot } from 'react-dom/client';
import { DemoPlayer } from '../components/birdeye-docs/demo-player';
import { buildDemoScripts } from '../components/birdeye-docs/demo-script';
import theme from '../components/birdeye-docs/birdeye-docs.module.css';
createRoot(document.getElementById('root')!).render(<div className={theme.root}><DemoPlayer scripts={buildDemoScripts([])} standalone/></div>);
