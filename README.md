# crunchy
Make flaky Javascript tests super flaky for easier triage by randomly delaying the task queue.

## What does crunchy do?

Crunchy uses zone.js to intercept Javascript's task queue, and adds random delays when executing tasks. The order of the tasks in the queue are preserved.

Play around with it here: https://stackblitz.com/edit/zonejs-basic-kumqfd?file=index.js

## How will this help find flaky tests?

Consider the following code:

```javascript
timer = Date.now();
console.log("Synchronous task 1");
setTimeout(function() {
  console.log("Async task 1");
}, 0);
console.log("Synchronous task 2");
```
Normally, the output of running this code would be:

```
Synchronous task 1
Async task 1
Synchronous task 2
```

If you run this code a thousand times, you may get the same result. However, this is not guaranteed. It just so happens that the `setTimeout` task was queued and then taken off of the queue so fast that the next line didn't get a chance to execute before the async code did. This is a problem because it shouldn't be guaranteed that it will execute; the async function could alter some state.

Let's say that `setTimeout` does some crunching and delays about 100ms. The synchronous code goes through maybe a thousand lines of code and accesses the variable that the async function updated, as the synchronous code takes a while and so it works when it gets there the async function is probably done. But there's an issue: what if it takes longer? This is where flaky tests start to appear.

Flaky tests exist in many forms, including ones which run async methods and those methods are so fast that you don't see the delay, except, well, sometimes.

Crunchy delays these async methods by a random amount of time; it's legal after all since the queue could be paused. This means that the output from the following after injecting crunchy could be:

```
Synchronous task 1
Synchronous task 2
Async task 1
```

or if you're lucky

```
Synchronous task 1
Async task 1
Synchronous task 2
```

This changes the execution flow, thus introducing a different path that the tests could take, and changes the state of the tests. If the tests fail, then they're flaky because it shouldn't matter how long a task takes; there should be something waiting for it to finish (the exception to this is animations.)

## Example

Here's an example (after including crunchy):
```javascript
z.run(function() {
    timer = Date.now();
    console.log("Synchronous task 1");
    setTimeout(function() {
        console.log("Async task 1");
    }, 0);
    console.log("Synchronous task 2");
});
```
