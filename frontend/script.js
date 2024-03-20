function checkGuess() {
    var userGuess = parseInt(document.getElementById("userGuess").value);
    var userLimit = parseInt(document.getElementById("userLimit").value);

    document.getElementById("resetButton").addEventListener("click", resetGame);

    // Check if userGuess and userLimit are valid numbers
    if (isNaN(userGuess) || isNaN(userLimit)) {
        console.error("Invalid input. Please enter valid numbers for guess and limit.");
        return;
    }

    var feedbackElement = document.getElementById("feedback");

    console.log("Submitting guess:", userGuess);

    fetch('/guess', {
        method: 'POST',
        body: JSON.stringify({ guess: userGuess, limit: userLimit }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log("Response status:", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Response received:", data);
            var feedbackMessage = data.feedback;
            var randomNumber = data.randomNumber;

            feedbackElement.textContent = feedbackMessage;

            if (randomNumber) {
                feedbackElement.textContent += " The correct number was: " + randomNumber;
            }
        })
        .catch(error => {
            console.error("Error fetching response:", error);
        });
}

// Function to reset the game
function resetGame() {
    // Send a GET request to the '/reset' endpoint
    fetch('/reset')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to reset the game.');
            }
            return response.json();
        })
        .then(data => {
            // Update the random number element with the new random number
            document.getElementById("randomNumber").textContent = data.randomNumber;

            // Clear feedback element
            document.getElementById("feedback").textContent = "";

            // Clear input fields
            document.getElementById("userGuess").value = "";
            document.getElementById("userLimit").value = "";
        })
        .catch(error => {
            console.error("Error resetting the game:", error);
        });
}

