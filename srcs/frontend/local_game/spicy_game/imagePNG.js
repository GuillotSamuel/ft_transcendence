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
        const pos = [100, 200 , 300, 400, 500];
        const randomIndex = Math.floor(Math.random() * pos.length);
        return pos[randomIndex];
    }

    draw(ctx, heightCanvas, randomValue)
    {

        if (this.imageLoaded && randomValue != 0) {
            ctx.drawImage(
                this.image,
                this.x - this.width / 2,
                (heightCanvas - randomValue) - this.height / 2,
                this.width,
                this.height
            );
        }
    }
}
