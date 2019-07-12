import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

var child: child_process.ChildProcess;

export default function watch(): void {
	console.log('watch()');
	child = child_process.spawn(
		process.argv0,
		process.argv.filter(v => {
			if (v.search(/^\w*watch\.js$/) > 0)
				return false;
			else if (process.argv0 === v)
				return false;
			else return true;
		}),
		{ detached: false, stdio: "inherit" }
	);

	child
		.on('close', (code, signal) => { })
		.on('error', (err) => { console.log('error', err); child.kill(); })
		.on('exit', (code, signal) => { console.log('exit', code, signal); watch(); });

	fs.watch(path.resolve(process.cwd()), { recursive: true }, (evt, fname) => {
		let t = 1000;
		if (fname.search(/\.js$/) > 0) t = 1;
		else if (fname.search(/\.ts$/) > 0) return;
		else return;
		setTimeout(() => {
			console.log(`File ${fname} changed.`);
			child.kill();
		}, t)
	});
}