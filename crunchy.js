let timer;
// based off of https://indepth.dev/i-reverse-engineered-zones-zone-js-and-here-is-what-ive-found/
const z = Zone.current.fork({
  name: "z",
  onInvokeTask(delegate, currentZone, targetZone, task, ...args) {
    function sleep(sleepDuration) {
      var now = new Date().getTime();
      while (new Date().getTime() < now + sleepDuration) {
        /* do nothing */
      }
    }
    sleep(Math.round(Math.random() * 1000));
    return delegate.invokeTask(targetZone, task, ...args);
  }
});

// run your code via z.run(<function>)
