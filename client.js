const fetch = require("node-fetch");

async function initializeServer() {
  try {
    const response = await fetch("http://localhost:3000/initialize");
    if (!response.ok) {
      throw new Error(
        `Failed to initialize server. Status code: ${response.status}`
      );
    }
    const { size } = await response.json();
    return size;
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function fetchValue(rowIndex, colIndex) {
  try {
    const response = await fetch(
      `http://localhost:3000/value?rowIndex=${rowIndex}&colIndex=${colIndex}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch value at rowIndex ${rowIndex} and colIndex ${colIndex}. Status code: ${response.status}`
      );
    }
    const { value } = await response.json();
    return value;
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function fetchAndPrintArray() {
  const size = await initializeServer();
  const array = [];

  for (let rowIndex = 0; rowIndex < size; rowIndex += 2) {
    for (let colIndex = 0; colIndex < size; colIndex += 2) {
      // Fetch 2 values concurrently
      const [value1, value2] = await Promise.all([
        fetchValue(rowIndex, colIndex),
        fetchValue(rowIndex, colIndex + 1),
      ]);
      const [value3, value4] = await Promise.all([
        fetchValue(rowIndex + 1, colIndex),
        fetchValue(rowIndex + 1, colIndex + 1),
      ]);

      // Build a 2x2 subarray
      const subarray = [
        [value1, value2],
        [value3, value4],
      ];

      // Push the subarray into the main array
      array.push(subarray);
    }
  }

  // Print the 2D array
  console.log(array);
}

// Call the fetchAndPrintArray function to execute the steps
fetchAndPrintArray();
