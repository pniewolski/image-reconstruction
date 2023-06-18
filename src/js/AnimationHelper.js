class AnimationHelper {
    constructor() {
        this.queue = [];
        this.pointer = 0;
    }

    addTask(functionRef, delay, ...args) {
        let task = {
            f: functionRef,
            d: delay,
            a: args
        }
        this.queue.push(task);
    }

    addTaskLoop(functionRef, delay, repeats, ...args) {
        for (let n=0; n<repeats; n++) {
            let newArgs = [n].concat(args);
            this.addTask(functionRef,delay,...newArgs);
        }
    }

    executeNext(self) {
        if (self.pointer >= self.queue.length) {
            return;
        }
        const current = self.queue[self.pointer];
        const startTime = Date.now();

        current.f(...current.a);

        const elapsedTime = Date.now() - startTime;
        const delay = Math.max(current.d - elapsedTime, 10);
        self.pointer += 1;
        setTimeout(self.executeNext, delay, self);
    }

    start() {
        this.executeNext(this);
    }
}

export default AnimationHelper;