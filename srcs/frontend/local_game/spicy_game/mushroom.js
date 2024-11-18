export class imagePNG {
    constructor(x, y, width, height, imagePath, onImageLoadCallback) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;

        // Ajouter un indicateur pour vérifier si l'image est chargée
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
            if (onImageLoadCallback) {
                onImageLoadCallback(); // Appeler le callback lorsque l'image est prête
            }
        };
    }


    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(
                this.image,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        }
    }
}
