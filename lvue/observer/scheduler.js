
import { nextTick } from '../core/util/next-tick';
let queue = [];
let has = {},
	index = 0;
let waiting = false,
	flushing = false;

function cleanScheduleQueue() {
	index = 0;
	queue = [];
	waiting = flushing = false;
}

/**
 * 
 * @return {[type]} [description]
 */
function flushScheduleQueue() {
	queue.sort((a, b) => a.id - b.id);
	flushing = true;
	for (index = 0; index < queue.length; index++) {
		let watcher = queue[index];
		watcher.run();
		has[watcher.id] = null;
	}
	cleanScheduleQueue();
}

export function watcherQueue(watcher) {
	let id = watcher.id;
	if (!has[id]) {
		has[id] = true;
		if (!flushing) {
	      queue.push(watcher);
	    } else {
	      // if already flushing, splice the watcher based on its id
	      // if already past its id, it will be run next immediately.
	      let i = queue.length - 1
	      while (i > index && queue[i].id > watcher.id) {
	        i--;
	      }
	      queue.splice(i + 1, 0, watcher);
	    }
	}
	if (!waiting) {
		waiting = true;
		nextTick(flushScheduleQueue);
	}
}