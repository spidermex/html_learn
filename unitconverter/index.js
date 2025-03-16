
      document.addEventListener("DOMContentLoaded", function () {
        const convertBtn = document.getElementById("convert-btn");
        const inputEl = document.getElementById("conversion-input");
        const lengthResultEl = document.getElementById("length-result");
        const volumeResultEl = document.getElementById("volume-result");
        const massResultEl = document.getElementById("mass-result");

        // Conversion functions
        function convertLength(value) {
          const metersToFeet = (value * 3.281).toFixed(3);
          const feetToMeters = (value / 3.281).toFixed(3);
          return `${value} meters = ${metersToFeet} feet | ${value} feet = ${feetToMeters} meters`;
        }

        function convertVolume(value) {
          const litersToGallons = (value * 0.264).toFixed(3);
          const gallonsToLiters = (value / 0.264).toFixed(3);
          return `${value} liters = ${litersToGallons} gallons | ${value} gallons = ${gallonsToLiters} liters`;
        }

        function convertMass(value) {
          const kilosToPounds = (value * 2.205).toFixed(3);
          const poundsToKilos = (value / 2.205).toFixed(3);
          return `${value} kilos = ${kilosToPounds} pounds | ${value} pounds = ${poundsToKilos} kilos`;
        }

        // Initial conversion
        updateConversions(20);

        // Event listener for convert button
        convertBtn.addEventListener("click", function () {
          const inputValue = parseFloat(inputEl.value);
          if (!isNaN(inputValue)) {
            updateConversions(inputValue);
          }
        });

        // Update all conversion results
        function updateConversions(value) {
          lengthResultEl.textContent = convertLength(value);
          volumeResultEl.textContent = convertVolume(value);
          massResultEl.textContent = convertMass(value);
        }

        // Allow Enter key to trigger conversion
        inputEl.addEventListener("keyup", function (event) {
          if (event.key === "Enter") {
            convertBtn.click();
          }
        });
      });
    