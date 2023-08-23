import '@polkadot/api-augment';
import SetupApp from 'SetupApp.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.min.css';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);

root.render(<SetupApp />);
