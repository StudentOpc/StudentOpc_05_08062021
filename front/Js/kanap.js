//================PAGE CONSTRUCTOR==================//
// on definit la structure et les attributs de l'objet que l'on attend
class Kanap {
    constructor({
        name,
        imageUrl,
        price,
        _id,
        description,
        lenses,
        quantity,
        altTxt,
        colors
    }) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.price = price;
        this.id = _id;
        this.description = description;
        this.lenses = lenses;
        this.altTxt = altTxt;
        this.colors = colors;
        this.quantity = parseInt(quantity, 10); // transforme chaine de caractère en nombre
    }
};
//Le Constructeur permet de donnée un tableau a l'API
//Les .this permettent de donné une variable utilisable par le "innerHTML"
//================FIN PAGE CONSTRUCTOR==================//