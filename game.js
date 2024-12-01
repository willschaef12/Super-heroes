const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function drawStartScreen() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the title
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center"; // Center-align text horizontally
  ctx.fillText("Heroes Unleashed", canvas.width / 2, 100);

  // Draw the subtitle
  ctx.font = "20px Arial";
  ctx.fillText("Welcome to the Game!", canvas.width / 2, 150);

  // Draw the Start button
  const buttonWidth = 150;
  const buttonHeight = 50;
  const buttonX = (canvas.width - buttonWidth) / 2; // Center the button horizontally
  const buttonY = (canvas.height - buttonHeight) / 2; // Center the button vertically
  ctx.fillStyle = "green";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  // Add text to the button
  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  ctx.fillText("Start", canvas.width / 2, buttonY + buttonHeight / 2 + 8); // Center text within the button
}

drawStartScreen();
