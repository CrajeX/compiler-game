// Creates a function that can be exported to another project, this function calls the dialouge box and puts sentences inside of it
export function displayDialogue(text, onDisplayEnd) {
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue");
    dialogueUI.style.display = "block"; // Make the dialogue UI visible

    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if (index < text.length) {
            currentText += text[index]; // Add one character at a time to the current text
            dialogue.innerHTML = currentText; // Update the inner HTML
            index++;
        } else {
            clearInterval(intervalRef); // Stop the interval when all text has been displayed
        }
    }, 50); // Adjusted timing for better readability (change back to 5ms if needed)

    const closeBtn = document.getElementById("close");

    function onCloseBtnClick() {
        onDisplayEnd(); // Trigger callback when dialogue ends
        dialogueUI.style.display = "none"; // Hide the dialogue UI
        dialogue.innerHTML = ""; // Clear the dialogue text
        clearInterval(intervalRef); // Ensure the interval is cleared
        closeBtn.removeEventListener("click", onCloseBtnClick); // Clean up event listener
    }

    closeBtn.addEventListener("click", onCloseBtnClick); // Add click event to close button
}
//Creates a FOV or how clsoe the camera is to the player
export function setCamScale(k){
    const resizeFactor = k.width()/k.height();
    if(resizeFactor < 1){
        k.camScale(k.vec2(1));
        return;
    }
    k.camScale(k.vec2(1.5))
}