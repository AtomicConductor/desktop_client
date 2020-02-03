/*
 * credits: https://github.com/chenzhihao/easy-promise-queue
 * the original npm could not be integrated into this codebase
 * as webpack threw critical errors due to "umd" module generation mode.
 *
 * This is a simplified bare-bone version of that queue.
 */
export default class PromiseQueue {
  constructor({ concurrency = 1 }) {
    this.queue = [];
    this.runningTasksCount = 0;
    this.concurrency = concurrency;
  }

  add(task) {
    const runTask = async () => {
      try {
        this.runningTasksCount++;
        await task();
      } finally {
        this.runningTasksCount--;
        if (this.runningTasksCount < this.concurrency && this.queue.length) {
          const nextTask = this.queue.shift();
          if (nextTask) await nextTask();
        }
      }
    };

    if (this.runningTasksCount < this.concurrency) {
      runTask();
    } else {
      this.queue.push(runTask);
    }
    return this;
  }

  get waitingCount() {
    return this.queue.length;
  }
}
