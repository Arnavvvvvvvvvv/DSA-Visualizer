const container = document.getElementById("array-container");
let array = [];
let speed = 100;

document.getElementById("speed").addEventListener("input", e => {
  speed = +e.target.value;
});

function generateArray(size = window.innerWidth < 600 ? 20 : 30) {
  array = [];
  container.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const val = Math.floor(Math.random() * 250) + 20;
    array.push(val);

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${val}px`;

    const label = document.createElement("div");
    label.className = "label";
    label.innerText = val;
    bar.appendChild(label);

    container.appendChild(bar);
  }
}
generateArray();

function disableControls(disable) {
  document.querySelectorAll("button, select, input").forEach(el => {
    el.disabled = disable;
  });
}

function showTimeComplexity(algo) {
  const complexities = {
    bubble: "Bubble Sort: O(n²)",
    selection: "Selection Sort: O(n²)",
    insertion: "Insertion Sort: O(n²)",
    merge: "Merge Sort: O(n log n)",
    quick: "Quick Sort: O(n log n) avg, O(n²) worst",
    heap: "Heap Sort: O(n log n)"
  };
  document.getElementById("complexity-info").innerText =
  "✅ " + complexities[algo];
}

function getSpeed() {
  const rawSpeed = document.getElementById("speed").value;
  return 101 - rawSpeed; // Inverted speed: higher = faster
}


async function startSort() {
  const algo = document.getElementById("algo").value;
  disableControls(true);
  if (algo === "bubble") await bubbleSort();
  else if (algo === "selection") await selectionSort();
  else if (algo === "insertion") await insertionSort();
  else if (algo === "merge") await mergeSort(array, 0, array.length - 1);
  else if (algo === "quick") await quickSort(0, array.length - 1);
  else if (algo === "heap") await heapSort();
  showTimeComplexity(algo);
  disableControls(false);
}

// Delay helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort
async function bubbleSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].classList.add("active");
      bars[j + 1].classList.add("active");
      await sleep(getSpeed());
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
        bars[j].firstChild.innerText = array[j];
        bars[j + 1].firstChild.innerText = array[j + 1];
      }
      bars[j].classList.remove("active");
      bars[j + 1].classList.remove("active");
    }
    bars[array.length - 1 - i].classList.add("sorted");
  }
  bars[0].classList.add("sorted");
}

// Selection Sort
async function selectionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length; i++) {
    let min = i;
    bars[min].classList.add("active");
    for (let j = i + 1; j < array.length; j++) {
      bars[j].classList.add("active");
      await sleep(getSpeed());
      if (array[j] < array[min]) {
        bars[min].classList.remove("active");
        min = j;
        bars[min].classList.add("active");
      }
      bars[j].classList.remove("active");
    }
    if (min !== i) {
      [array[i], array[min]] = [array[min], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[min].style.height = `${array[min]}px`;
      bars[i].firstChild.innerText = array[i];
      bars[min].firstChild.innerText = array[min];
    }
    bars[min].classList.remove("active");
    bars[i].classList.add("sorted");
  }
}

// Insertion Sort
async function insertionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1]}px`;
      bars[j + 1].firstChild.innerText = array[j + 1];
      j--;
      await sleep(getSpeed());
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[j + 1].firstChild.innerText = key;
  }
  Array.from(bars).forEach(bar => bar.classList.add("sorted"));
}

// Merge Sort
async function mergeSort(arr, l, r) {
  if (l >= r) return;
  const m = l + Math.floor((r - l) / 2);
  await mergeSort(arr, l, m);
  await mergeSort(arr, m + 1, r);
  await merge(l, m, r);
}

async function merge(l, m, r) {
  const bars = document.getElementsByClassName("bar");

  let left = array.slice(l, m + 1);
  let right = array.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    bars[k].classList.add("active");
    await sleep(getSpeed());
    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }
    bars[k].style.height = `${array[k]}px`;
    bars[k].firstChild.innerText = array[k];
    bars[k].classList.remove("active");
    bars[k].classList.add("sorted");
    k++;
  }

  while (i < left.length) {
    bars[k].classList.add("active");
    await sleep(getSpeed());
    array[k] = left[i++];
    bars[k].style.height = `${array[k]}px`;
    bars[k].firstChild.innerText = array[k];
    bars[k].classList.remove("active");
    bars[k].classList.add("sorted");
    k++;
  }

  while (j < right.length) {
    bars[k].classList.add("active");
    await sleep(getSpeed());
    array[k] = right[j++];
    bars[k].style.height = `${array[k]}px`;
    bars[k].firstChild.innerText = array[k];
    bars[k].classList.remove("active");
    bars[k].classList.add("sorted");
    k++;
  }
}

// Quick Sort
async function quickSort(low, high) {
  if (low < high) {
    const pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  } else if (low >= 0 && high >= 0 && low < array.length && high < array.length) {
    document.getElementsByClassName("bar")[low].classList.add("sorted");
    document.getElementsByClassName("bar")[high].classList.add("sorted");
  }
}

async function heapSort() {
  const n = array.length;
  const bars = document.getElementsByClassName("bar");

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Swap root with end
    [array[0], array[i]] = [array[i], array[0]];
    updateBar(0);
    updateBar(i);
    bars[i].classList.add("sorted");

    await heapify(i, 0);
  }
  bars[0].classList.add("sorted");
}

async function heapify(n, i) {
  const bars = document.getElementsByClassName("bar");
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    updateBar(i);
    updateBar(largest);
    bars[i].classList.add("active");
    bars[largest].classList.add("active");
    await sleep(getSpeed());
    bars[i].classList.remove("active");
    bars[largest].classList.remove("active");

    await heapify(n, largest);
  }
}


async function partition(low, high) {
  const bars = document.getElementsByClassName("bar");
  let pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    bars[j].classList.add("active");
    await sleep(getSpeed());
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[i].firstChild.innerText = array[i];
      bars[j].style.height = `${array[j]}px`;
      bars[j].firstChild.innerText = array[j];
    }
    bars[j].classList.remove("active");
  }

  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  bars[i + 1].style.height = `${array[i + 1]}px`;
  bars[i + 1].firstChild.innerText = array[i + 1];
  bars[high].style.height = `${array[high]}px`;
  bars[high].firstChild.innerText = array[high];
  bars[high].classList.add("sorted");
  bars[i + 1].classList.add("sorted");

  return i + 1;
}

function updateBar(index) {
  const bar = document.getElementsByClassName("bar")[index];
  bar.style.height = `${array[index]}px`;
  bar.firstChild.innerText = array[index];
}
