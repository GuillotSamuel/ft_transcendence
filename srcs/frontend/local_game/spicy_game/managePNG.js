import { imagePNG } from "./mushroom.js";

export function createBoostPNG(Name, canvas) {

    let boostPNG;

    if (Name == "Fat"){
        boostPNG = new imagePNG (
            canvas.width / 2,
            canvas.height / 2,
            80, // Largeur du champignon
            80, // Hauteur du champignon
            "./local_game/spicy_game/fat_mushroom.png"
        ) // Chemin vers l'image
    }
    else if (Name == "Skinny"){
        boostPNG = new imagePNG (
            canvas.width / 2,
            canvas.height / 2,
            80, // Largeur du champignon
            80, // Hauteur du champignon
            "./local_game/spicy_game/pink_mushroom.png"
        ) // Chemin vers l'image
    }
    else{
        boostPNG = new imagePNG (
            canvas.width / 2,
            canvas.height / 2,
            80, // Largeur du champignon
            80, // Hauteur du champignon
            "./local_game/spicy_game/speed.png"
        ) // Chemin vers l'image
    }
    return boostPNG;
}