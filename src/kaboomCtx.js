import kaboom from "kaboom";
export const k = kaboom({
    global:false,
    touchToMouse:true,
    canvas:document.getElementById("game"),
})
//Gets the Kaboom app and put it on the canvas