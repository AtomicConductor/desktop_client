import PromiseQueue from "../promiseQueue";

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

describe("Promise Queue", () => {
  it("executes one promise at a time when concurrency is set to 1", async () => {
    const promiseQueue = new PromiseQueue({ concurrency: 1 });

    const task = async () => {
      await sleep(50);
      expect(promiseQueue.runningTasksCount).toBe(1);
    };

    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(task);

    expect(promiseQueue.waitingCount).toBe(2);
    expect(promiseQueue.runningTasksCount).toBe(1);
  });

  it("executes n promises at a time when concurrency is set to n", async () => {
    const promiseQueue = new PromiseQueue({ concurrency: 2 });

    const task = async () => {
      await sleep(50);
      expect(promiseQueue.runningTasksCount).toBe(2);
    };

    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(async () => {
      await sleep(50);
      expect([1, 2]).toContain(promiseQueue.runningTasksCount);
    });

    expect(promiseQueue.runningTasksCount).toBe(2);
    expect(promiseQueue.waitingCount).toBe(3);
  });

  it("add calls are chainable", async () => {
    const q = new PromiseQueue({ concurrency: 1 });

    const task = async () => {
      expect(q.runningTasksCount).toBe(1);
      await sleep(50);
      expect(q.waitingCount).toBe(1);
      expect(q.runningTasksCount).toBe(1);
    };

    const qInstance = q.add(task).add(task);

    expect(qInstance).toBeInstanceOf(PromiseQueue);
  });
});
