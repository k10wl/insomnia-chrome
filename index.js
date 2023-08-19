document.addEventListener("readystatechange", function () {
  const NAME = "Insomnia";

  const lockSrc = chrome.runtime.getURL("assets/in.mp3");
  const lockAudio = new Audio(lockSrc);

  const releaseSrc = chrome.runtime.getURL("assets/out.mp3");
  const releaseAudio = new Audio(releaseSrc);

  let wakeLock = null;

  function onRelease() {
    console.log(NAME + ": released");
    releaseAudio.play();
    wakeLock = null;
  }

  function onLock() {
    console.log(NAME + ": locked");
    lockAudio.play();
  }

  async function lockScreen() {
    if (wakeLock) {
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request();

      onLock();

      wakeLock.onrelease = onRelease;
    } catch (e) {
      console.error(NAME + ": ", e);
      wakeLock = null;
    }
  }

  function releaseScreen() {
    if (!wakeLock) {
      return;
    }

    wakeLock.release();
  }

  function onKeyDown(e) {
    if (!e.ctrlKey) {
      return;
    }

    const actions = {
      KeyR() {
        releaseScreen();
      },
      KeyL() {
        lockScreen();
      },
    };

    return actions[e.code] && actions[e.code]();
  }

  document.addEventListener("keydown", onKeyDown);
});
