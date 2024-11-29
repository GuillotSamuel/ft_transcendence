import { imagePNG } from "./imagePNG.js";

export function createBoostPNG(Name, canvas)
{

    let boostPNG;
    let size = 60;

    if (Name == "Fat"){
        boostPNG = new imagePNG (
            "Fat",
            canvas.width / 2,
            canvas.height / 2,
            size, // Largeur du champignon
            size, // Hauteur du champignon
            "./local_game/spicy_game/png/fat_mushroom.png"
        ) // Chemin vers l'image
    }
    else if (Name == "Skinny"){
        boostPNG = new imagePNG (
            "Skinny",
            canvas.width / 2,
            canvas.height / 2,
            size, // Largeur du champignon
            size, // Hauteur du champignon
            "./local_game/spicy_game/png/pink_mushroom.png"
        ) // Chemin vers l'image
    }
    else{
        boostPNG = new imagePNG (
            "default",
            canvas.width / 2,
            canvas.height / 2,
            size, // Largeur du champignon
            size, // Hauteur du champignon
            "./local_game/spicy_game/png/speed.png"
        ) // Chemin vers l'image
    }
    return boostPNG;
}