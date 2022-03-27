/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';

import Routing from './Routing';
import { Router } from 'solid-app-router';

render(() => <Router><Routing /></Router>, document.getElementById('root') as HTMLElement);
