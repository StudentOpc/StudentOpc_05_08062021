//================PAGE PRODUITS==================//

//----------------------------------------------------------------------------------------------
// Fonction asynchrone, ajout de l'id du produit à la page et gère le clique "ajouter au panier"
//----------------------------------------------------------------------------------------------
async function loadproduct() {


    //Déclaration d'UrlSearchParams qui focus l'id de l'url sur la page produit
    var id_produit = (new URL(window.location).searchParams.get("id"));
    // console.log(id_produit)
    var local = "http://localhost:3000/";
    var nameapi = "api/products/";
    var prod = await fetch(local + nameapi + id_produit);
    var produ = await prod.json();
    var produ_img = await produ.imageUrl;
    var produc_img = produ_img.replace(local, '');


    //Récupère et applique l'image du produit
    const ITEM__BALISES = document.querySelector("div.item__img img");
    ITEM__BALISES.setAttribute('src', `../../back/${produc_img}`);

    // Affiche le titre le prix et la description à la page détail du produit
    let ITEM__BALISEST = document.getElementById("title");
    let ITEM__BALISESP = document.getElementById("price");
    let ITEM__BALISESD = document.getElementById("description");
    ITEM__BALISEST.textContent = produ.name;
    ITEM__BALISESP.textContent = produ.price;
    ITEM__BALISESD.textContent = produ.description;


    //Récupere la couleur des produits
    let tab = produ.colors;
    // console.log(tab);

    //Focus sur bouton sélection couleurs
    const select_op = document.getElementById('colors');


    // Ajoute une option tant selon le nombre de couleur qu'il y à dans l'api
    for (ui in tab) {
        select_op.options[select_op.options.length] = new Option(tab[ui], tab[ui])
        // console.log(ui)
    }


    //Focus sur Le bouton "ajouter au panier"
    const AJOUT_PANIER = document.querySelector("#addToCart");

    //Ecoute le clic et récupère les données écrit sur la page HTML (page produit)
    AJOUT_PANIER.addEventListener("click", function (e) {
        const productQuantity = document.getElementById('quantity');
        const productColors = document.getElementById('colors');

        // Déclaration de la sélection des valeurs de "quantity","Color","option"
        /**
         * [recupValueInput] Quantité choisi de l'utilisateur 
         * 
         * [indexChoise,choiseValue] Choix de la couleur de l'utilisateur 
         * 
         * [choiseValueZero] Choix utilisateur à l'index [0] = "--SVP, choisissez une couleur --" 
         * 
         * [stock] Déclaration d'un objet contenant toute les données API et choix fait par l'utilisateur 
         */

        let recupValueInput = parseInt(productQuantity.value);
        let indexChoise = productColors.selectedIndex;
        let choiseValue = productColors.options[indexChoise].value;
        console.log("colorChoosen : " + choiseValue);

        let choiseValueZero = productColors.options[0].value;

        //Création d'un objet qui stock les données dans le localstorage
        const stock = { id: produ._id, name: produ.name, color: choiseValue, quantity: recupValueInput, image: produc_img, price: produ.price };
        // console.log(stock)

        let existingStorage = JSON.parse(localStorage.getItem("data")) || [];

        //Accède a cette fonction
        existingStorageCart(stock, existingStorage, choiseValue, choiseValueZero);

    });
}
loadproduct();


// Affichage d'un message d'ajout du produit dans le panier
function msgProductAjout() {
    let focusDiv = document.querySelector("#ajoutPanier");
    focusDiv.innerHTML = ' Cette article a été ajouté à votre panier';
    focusDiv.style.fontWeight = "bold";
    focusDiv.style.fontStyle = "italic";
    focusDiv.style.Width = "20%";
    focusDiv.style.color = "rgb(48 219 48)";
    setTimeout(() => { focusDiv.innerHTML = ""; }, 800);
}


//----------------------------------------------------------------------------------------------
// Calcule la quantité fournis par l'utilisateur et l'actualise ou l'ajoute dans le localStorage
//(relié avec "loadproduct() > AJOUT_PANIER.addEventListener")
//----------------------------------------------------------------------------------------------
function existingStorageCart(stock, existingStorage, choiseValue, choiseValueZero) {

    // Récupération des données dans le localstorage
    const myproduct = existingStorage.find(item => item.id == stock.id && item.color == stock.color);

    //Si la quantité est superieur à 0 && que la couleur est différent de la valeur "null" (string)
    if (stock.quantity > 0 && stock.color != "null") { //Exécute le code suivant

        //Si le localstorage n'est pas vide
        if (myproduct != null) {

            //Initialisation des numbers
            let stockqty = 0;
            let itemqty = 0;
            let priceCalc = 0;

            //Calcule d'ajout de la quantité input.value + valeur du localstorage déja ajouté par le else if
            stockqty = stock.quantity; // valeur de l'objet "stock"
            itemqty = myproduct.quantity; // Valeur du localstorage
            myproduct.quantity = (stockqty + itemqty);  // si c'est le cas on additionne l'ancienne quantité pour ce produit et la nouvelle quantité

            //Calcule du prix multiplié par la quantité du produit + 1
            priceCalc = stock.price;
            myproduct.price = priceCalc * (itemqty + 1);

            localStorage.setItem('data', JSON.stringify(existingStorage)); // puis on ecrase ce produit avec sa nouvelle quantité

            // Affiche un message d'ajout du produit dans le panier
            msgProductAjout()

            // alert("Cette article a été ajouté à votre panier");
        }
        // else if (choiseValue == choiseValueZero) {
        //     return
        // }
        else { //Si il n'y a rien dans le localstorage
            stock.price = stock.quantity * stock.price
            existingStorage.push(stock);
            localStorage.setItem('data', JSON.stringify(existingStorage));
            
            // Affichage d'un message d'ajout du produit dans le panier
            msgProductAjout()
        }
    } else { // Sinon affiche cette alerte
        alert("Veulliez saisir une quantité supérieur à 0 et choisir une couleur")
    }
}
//================FIN PAGE PRODUITS==================//