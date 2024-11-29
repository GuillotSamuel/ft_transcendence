export class imagePNG 
{
    constructor(name, x, y, width, height, imagePath, onImageLoadCallback) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;
        this.drawY = 0;
        this.drawX = 0;

        // Ajouter un indicateur pour vérifier si l'image est chargée
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
            if (onImageLoadCallback) {
                onImageLoadCallback(); // Appeler le callback lorsque l'image est prête
            }
        };
    }

    getName()
    {
        return this.name;
    }
    
    getRandomPosition() 
    {
        const pos = [50, 60, 75, 275, 290, 300];
        const randomIndex = Math.floor(Math.random() * pos.length);
        return pos[randomIndex];
    }

    draw(ctx, heightCanvas, randomValue)
    {
        this.drawY = (heightCanvas - randomValue) - this.height / 2;
        this.drawX = this.x - this.width / 2; // Start draw image, moins la moite de la largeur de l'image.
        if (this.imageLoaded && randomValue != 0) {
            ctx.drawImage(
                this.image,
                this.drawX,
                this.drawY,
                this.width,
                this.height
            );
        }
    }
}
