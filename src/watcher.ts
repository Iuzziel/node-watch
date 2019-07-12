import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

var child: child_process.ChildProcess;
var watcher: fs.FSWatcher;

export default function watch(): void {
	child = child_process.spawn(
		process.argv0,
		process.argv.filter(v => {
			if (v.search(/(^\S*@iuzziel[\\\/]+node-watch-lib[\\\/]+lib[\\\/]+index[\.js]*$|^\S*watch(\.js|\.cmd)?$)/) >= 0 || process.argv0 === v)
				return false;
			else
				return true;
		}),
		{ detached: false, stdio: "inherit" }
	);

	child
		.on('error', (err) => { child.kill(); throw err; })
		.on('exit', (code, signal) => { console.log(`\x1b[34m< Watcher ask for restart >\x1b[0m`); watch(); });

	watcher = fs.watch(path.resolve(process.cwd()), { persistent: false, recursive: true }, (evt, fname) => {
		if (fname.search(/\.js$/) > 0) {
			watcher.close();
			child.kill();
		}
		else if (fname.search(/\.ts$/) > 0) {
			return;
		} else {
			return
		};
	});
}