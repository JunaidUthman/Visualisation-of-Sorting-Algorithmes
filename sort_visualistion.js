
let tab = [];
let ordre;
let delay = 100;
let bars = [];  
let isPaused = false; 


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function checkPause() {
  while (isPaused) {
    await sleep(50);
  }
}


function createBars(arr) {
  const barsContainer = document.getElementById("bars");
  barsContainer.innerHTML = "";  
  bars = [];
  arr.forEach(val => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${val * 3}px`;
    bars.push(bar);
    barsContainer.appendChild(bar);
  });
}


function updateBars(arr) {
  for (let i = 0; i < arr.length; i++) {
    bars[i].style.height = `${arr[i] * 3}px`;
  }
}


async function selectionSort(ordre, arr) {
  for (let i = 0; i < arr.length; i++) {
    let selected = i;
    for (let j = i + 1; j < arr.length; j++) {
      if ((ordre === "croissant" && arr[j] < arr[selected]) ||
          (ordre === "decroissant" && arr[j] > arr[selected])) {
        selected = j;
      }
    }
    if (selected !== i) {
      [arr[i], arr[selected]] = [arr[selected], arr[i]];
      updateBars(arr);
      await sleep(delay);
      await checkPause();
    }
  }
}


async function bubbleSort(ordre, arr) {
  let n = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if ((ordre === "croissant" && arr[i] > arr[i+1]) ||
          (ordre === "decroissant" && arr[i] < arr[i+1])) {
        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
        updateBars(arr);
        await sleep(delay);
        await checkPause();
        swapped = true;
      }
    }
    n--;
  } while (swapped);
}

async function insertionSort(ordre, arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && ((ordre === "croissant" && arr[j] > key) ||
                      (ordre === "decroissant" && arr[j] < key))) {
      arr[j+1] = arr[j];
      j--;
      updateBars(arr);
      await sleep(delay);
      await checkPause();
    }
    arr[j+1] = key;
    updateBars(arr);
    await sleep(delay);
    await checkPause();
  }
}

async function quickSort(ordre, arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = await partition(ordre, arr, low, high);
    await quickSort(ordre, arr, low, pi - 1);
    await quickSort(ordre, arr, pi + 1, high);
  }
}

async function partition(ordre, arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if ((ordre === "croissant" && arr[j] < pivot) ||
        (ordre === "decroissant" && arr[j] > pivot)) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      updateBars(arr);
      await sleep(delay);
      await checkPause();
    }
  }
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  updateBars(arr);
  await sleep(delay);
  await checkPause();
  return i+1;
}

async function mergeSort(ordre, arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let mid = Math.floor((low + high) / 2);
    await mergeSort(ordre, arr, low, mid);
    await mergeSort(ordre, arr, mid + 1, high);
    await merge(ordre, arr, low, mid, high);
  }
}

async function merge(ordre, arr, low, mid, high) {
  let left = arr.slice(low, mid + 1);
  let right = arr.slice(mid + 1, high + 1);
  let i = 0, j = 0, k = low;
  while (i < left.length && j < right.length) {
    if ((ordre === "croissant" && left[i] <= right[j]) ||
        (ordre === "decroissant" && left[i] >= right[j])) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
    updateBars(arr);
    await sleep(delay);
    await checkPause();
  }
  while (i < left.length) {
    arr[k] = left[i];
    i++;
    k++;
    updateBars(arr);
    await sleep(delay);
    await checkPause();
  }
  while (j < right.length) {
    arr[k] = right[j];
    j++;
    k++;
    updateBars(arr);
    await sleep(delay);
    await checkPause();
  }
}


document.getElementById("submit").onclick = async function() {
  let type = document.getElementById("type").value;
  let size = parseInt(document.getElementById("size").value);
  ordre = document.getElementById("ordre").value;
  delay = parseInt(document.getElementById("speed").value);


  tab = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  createBars(tab);
  await sleep(500); 

  if (type === "quick") {
    await quickSort(ordre, tab);
  } else if (type === "merge") {
    await mergeSort(ordre, tab);
  } else if (type === "selection") {
    await selectionSort(ordre, tab);
  } else if (type === "bulle") {
    await bubbleSort(ordre, tab);
  } else if (type === "insertion") {
    await insertionSort(ordre, tab);
  }
};

document.getElementById("togglePause").onclick = function() {
  isPaused = !isPaused;
  this.innerText = isPaused ? "Resume" : "Pause";
};
