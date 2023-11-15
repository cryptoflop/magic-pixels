import './main.css'
import App from './App.svelte'

import cursor from './assets/images/cursor.png';
import pointCursor from './assets/images/cursor-point.png';
import grabCursor from './assets/images/cursor-grab.png';
import grabbingCursor from './assets/images/cursor-grabbing.png';

document.documentElement.style.setProperty('--cursor-default', `url(${cursor}), auto`);
document.documentElement.style.setProperty('--cursor-pointer', `url(${pointCursor}), auto`);
document.documentElement.style.setProperty('--cursor-grab', `url(${grabCursor}), auto`);
document.documentElement.style.setProperty('--cursor-grabbing', `url(${grabbingCursor}), auto`);

const app = new App({
	target: document.getElementById('app')!,
})

export default app
