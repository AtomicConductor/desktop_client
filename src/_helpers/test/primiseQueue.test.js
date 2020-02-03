import assert from "assert";
import PromiseQueue from "../promiseQueue";

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

describe("Promise Queue", () => {
  it("executes one promise at a time when concurrency is set to 1", async () => {
    const promiseQueue = new PromiseQueue({ concurrency: 1 });

    const task = async () => {
      await sleep(50);
      assert.strictEqual(promiseQueue.runningTasksCount, 1);
    };

    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(task);

    assert.strictEqual(promiseQueue.waitingCount, 2);
    assert.strictEqual(promiseQueue.runningTasksCount, 1);
  });

  it("executes n promises at a time when concurrency is set to n", async () => {
    const promiseQueue = new PromiseQueue({ concurrency: 2 });

    const task = async () => {
      await sleep(50);
      assert.strictEqual(promiseQueue.runningTasksCount, 2);
    };

    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(task);
    promiseQueue.add(async () => {
      await sleep(50);
      assert.ok([1, 2].includes(promiseQueue.runningTasksCount), 2);
    });

    assert.strictEqual(promiseQueue.runningTasksCount, 2);
    assert.strictEqual(promiseQueue.waitingCount, 3);
  });

  it("add calls are chainable", async () => {
    const q = new PromiseQueue({ concurrency: 1 });

    const task = async () => {
      assert.strictEqual(q.runningTasksCount, 1);
      await sleep(50);
      assert.strictEqual(q.waitingCount, 1);
      assert.strictEqual(q.runningTasksCount, 1);
    };

    const qInstance = q.add(task).add(task);

    assert.ok(qInstance instanceof PromiseQueue);
  });
});
