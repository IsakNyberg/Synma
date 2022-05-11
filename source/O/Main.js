const keys = [
	'KeyQ',
	'Digit2',
	'KeyW',
	'Digit3',
	'KeyE',
	'KeyR',
	'Digit5',
	'KeyT',
	'Digit6',
	'KeyY',
	'Digit7',
	'KeyU',
	'KeyI'
];
var keyboard = new Keyboard(window, keys);
var synth = new Synth();
keyboard.connect(synth);
