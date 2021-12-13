//================PAGE PANIER==================//

//--------------------------------------------------------------------
// Récupération données du LocalStorage pour les appliqués sur la page
//--------------------------------------------------------------------
function loadcart() {

    // Focus sur la section des panier
    const SECCART = document.getElementById("cart__items");

    // //Elément qui focus dans la sections id: cart__items
    // const IMGCART = document.querySelector("div.cart__item__img img");

    //Donnee du localStorage qui récupère la clé data
    let donneeStorages = JSON.parse(localStorage.getItem("data"));


    //***** Delete le premier élément du html ******
    (document.querySelector("#FocusArticle")).remove()

    //Si le localstorage n'est pas vide
    if (donneeStorages != null) {

        /**
         * "For"
         * Itère sur les éléments du localstorage
         * Ajoute un article tant qu'il y de produits dans le localstorage
         */
        for (let i = 0; i < donneeStorages.length; i++) {
            const element = donneeStorages[i];

            // let focusForAppendChild = document.getElementsByTagName('h1 section');

            // Apporte les données de l'api à l'html
            SECCART.innerHTML +=
                `
        <article class="cart__item" data-id="${element.id}">
        <div class="cart__item__img">
          <img src="../../back/${element.image}" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
            <h2>${element.name} / ${element.color}</h2>
            <p class="price_cart">${element.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100"
                value="${element.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>
        `
        }
    }
}
loadcart()


//--------------------------------------------------------------------------
// Ecoute le bouton supprimé et supprime l'item de l'HTML et du Localstorage
//--------------------------------------------------------------------------
function deleteProductListen() {
    let deleteLink = document.querySelectorAll(".deleteItem");

    // Ecoute pour chaque lien "supprimer"
    deleteLink.forEach(function (input) {
        input.addEventListener("click", function () {

            // Récuperation cle pour localstorage
            const productName = input
                .closest("div.cart__item__content")
                .querySelector("div.cart__item__content__titlePrice > h2").innerText;

            //Suppression cle local storage
            let existingStorage = JSON.parse(localStorage.getItem("data")) || [];

            const myproduct = existingStorage.findIndex(item => item.name + ' / ' + item.color == productName); // on retrouve l'index
            //console.log(myproduct);
            //localStorage.removeItem(myproduct);

            existingStorage.splice(myproduct, 1); //Enlève l'index

            localStorage.setItem('data', JSON.stringify(existingStorage)); //Actualise les données dans le localstorage
            input.closest("div.cart__item__content").parentNode.remove(); // suppression du noeud

            //Si le localstorage est vide (localstorage == À [] )
            if (existingStorage == 0) {
                localStorage.clear()
            }
            affichageTotalPrix(); // on recalcul les prix total et quantité total
        });
    });
}
deleteProductListen();


//--------------------------------------------------------------------------
// Fonction qui calcule la somme total du prix du panier
// (Relié avec > affichageTotalPrix())
//--------------------------------------------------------------------------
function calculSommePanierPrix() {

    //Enlèvement du deuxième résultat (Autre moyen de procéder)
    const focusForReplace = document.querySelector('section article:nth-child(2)');
    // focusForReplace.classList.add("none");

    const sommeProducts = JSON.parse(localStorage.getItem('data'));

    let totalProduct = 0;
    // const sp = Array.from(sommeProducts);

    if (sommeProducts != null) {
        //Itère sur le prix dans le localstorage
        for (sommeProduct of sommeProducts) {

            //Prend le prix du localstorage et l'ajoute a "totalproduct"
            totalProduct += parseInt(sommeProduct.price);
        }

    }
    // console.log(totalProduct)
    // console.log(sommeProducts)
    return totalProduct
}


//--------------------------------------------------------------------------
// Fonction qui calcule la somme total de la quantité des articles du panier
// (Relié avec > affichageTotalPrix())
//--------------------------------------------------------------------------
function calculSommePanierQuantity() {
    const sommeProducts = JSON.parse(localStorage.getItem('data'));

    let totalQuantityInput = 0;
    if (sommeProducts != null) {
        for (sommeProduct of sommeProducts) {
            //Prend la quantité du localstorage et l'ajoute a "totalproduct"
            totalQuantityInput += parseInt(sommeProduct.quantity);
            // console.log(totalQuantityInput)
        }
    }
    return totalQuantityInput
}


//----------------------------------------------------------------------------------------------
// Ecoute de la quantité de la valeur input, calcul les valeurs et les appliques au localstorage
//----------------------------------------------------------------------------------------------
function qtyListen() {

    // ******* Explication étape par étape ********

    let qtyInput = document.querySelectorAll(".itemQuantity");

    // Écoute pour chaque élement input
    qtyInput.forEach(function (input) {
        input.addEventListener("input", function (inputevent) {
            //Quantié de la valeur entré par l'utilisateur
            let inputQty = inputevent.target.value;

            //Si inpuQty est supérieur ou égale a 1 et inférieur à 100
            if (inputQty >= 1 && inputQty <= 100) {
                // Récupération du text de l'input
                const productName = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__titlePrice > h2").innerText;


                // console.log('productName : '+productName);

                // Récupération des données dans le localstorage
                let existingStorage = JSON.parse(localStorage.getItem("data")) || [];


                // Dans le localstorage le nom et la couleur dois avoir la même disposition de texte que sur la page HTML
                let myproduct = existingStorage.findIndex(item => item.name + ' / ' + item.color == productName); // ex: item.name / item.color == Kanap Sinopé / Blue


                let itemqty = parseInt(inputQty); // Transformation du string en number de la valeur de l'input changé
                let divisPrice = parseInt(existingStorage[myproduct].price) / parseInt(existingStorage[myproduct].quantity); // Divise le prix du localstorage par la quantité du localstorage (prix et quantité par défaut)

                // Applique la valeur de la quantité changé au localstorage
                existingStorage[myproduct].quantity = itemqty;

                // Multiplie le résultat de la division (divisPrice) avec la valeur changé
                let priceStorage = existingStorage[myproduct].price = divisPrice * itemqty;
                // console.log(parseInt(input.value));
                // console.log(divisPrice);


                localStorage.setItem("data", JSON.stringify(existingStorage)); // injection des calculs dans localstorage

                // Affichage des nouvelles Qte et Prix
                let priceCart = document.querySelectorAll(".price_cart")[myproduct];
                priceCart.textContent = priceStorage;

                affichageTotalPrix();

            } else {
                setTimeout(() => { alert("Veuillez choisir une quantité compris entre 1 et 100."); }, 1500);
            }
        });
    });
}
qtyListen();


//-----------------------------------------
// Affichage du total du panier sur le HTML
//-----------------------------------------
function affichageTotalPrix(totalProduct, totalQuantityInput) {
    let resultTT = calculSommePanierPrix(totalProduct); //Appel de fonction
    let resultTTQTY = calculSommePanierQuantity(totalQuantityInput); //Appel de fonction

    const focusTotalPrice = document.querySelector("#totalPrice");
    const focusTotalQuantity = document.querySelector("#totalQuantity");

    focusTotalPrice.textContent = resultTT; //Affichage du prix
    focusTotalQuantity.textContent = resultTTQTY; //Affichage de la quantité
    // console.log(resultTTQTY)
}
affichageTotalPrix();

/*********STYLE POUR LE TEXTE DES CHAMPS DE VALIDATION*********/

function styleValid(validColors) {
    validColors.style.fontWeight = "bold";
    validColors.style.fontStyle = "italic";
    validColors.style.Width = "20%";
    validColors.style.color = "rgb(48 219 48)";

}

function styleInvalid(invalidColors) {
    // console.log(invalidColors.getAttribute('class'))
    invalidColors.style.fontWeight = "bold";
    invalidColors.style.fontStyle = "italic";
    invalidColors.style.Width = "20%";
    invalidColors.style.color = "rgb(195 18 18)";
}

/****ECOUTE DES CHAMPS DE VALIDATIONS****/

//Focus sur la balise "form"
let focusForm = document.getElementById('loginform');

//Focus sur le bouton "Commander"
const COMMAND = document.getElementById('order');

const emailInput = document.getElementById('email').value;
let focusSmallFirstName = document.getElementById("errorMsgFirstName");
let focusSmallLastName = document.getElementById("errorMsgLastName");
let focusSmallAddress = document.getElementById("errorMsgAddress");
let focusSmallCity = document.getElementById("errorMsgCity");
let focusSmallEmail = document.getElementById("errorMsgEmail");

//-----------------------------------------------------------------
//                ****REGEX DE VALIDATIONS****
//-----------------------------------------------------------------


//-----------------------------------------------------------------
//Regex validation du Prénom | [Relié à validation()]
//-----------------------------------------------------------------
function validFirstName(iniVar) {

    let inputName = document.getElementById("firstName").value;
    //Initialisation du RegExp pour validation du firstName
    let regexNames = new RegExp('^[a-zA-Z\-ÇçéèëœÉÈÏïî]{2,32}$', 'g');
    let testRegNames = regexNames.test(inputName);

    // Si le test de validation renvoi false
    if (!testRegNames) {
        // iniVar++;
        let msg = "Veuillez renseigner un prénom valide";
        focusSmallFirstName.textContent = msg;
        msg = styleInvalid(focusSmallFirstName);
        return false
    } else {
        focusSmallFirstName.textContent = "";
        return true
    }
    // console.log(testRegNames);
    // return iniVar
}

//-----------------------------------------------------------------
//Regex validation du nom | [Relié à validation()]
//-----------------------------------------------------------------
function validLastName(iniVar) {

    let inputName = document.getElementById("lastName").value;
    //Initialisation du RegExp pour validation du firstName
    let regexNames = new RegExp('^[a-zA-Z\-ÇçéèëœÉÈÏïî]{2,32}$', 'g');
    let testRegNames = regexNames.test(inputName);

    // Si le test de validation renvoi false
    if (!testRegNames) {
        // iniVar++;
        let msg = "Veuillez renseigner un nom valide";
        focusSmallLastName.textContent = msg;
        msg = styleInvalid(focusSmallLastName);
        return false
    } else {
        focusSmallLastName.textContent = "";
        return true
    }
    // console.log(testRegNames);
    // return iniVar
}

//-----------------------------------------------------------------
//Regex validation de l'adresse | [Relié à validation()]
//-----------------------------------------------------------------
function validAddress(iniVar) {

    let inputName = document.getElementById("address").value;
    //Initialisation du RegExp pour validation du firstName
    let regexNames = new RegExp('^[a-zA-Z0-9\- ]{2,32}$', 'g');
    let testRegNames = regexNames.test(inputName);

    // Si le test de validation renvoi false
    if (!testRegNames) {
        // iniVar++;
        let msg = "Veuillez renseigner une adresse valide";
        focusSmallAddress.textContent = msg;
        msg = styleInvalid(focusSmallAddress);
        return false
    } else {
        focusSmallAddress.textContent = "";
        return true
    }
    // console.log(testRegNames);
    // return iniVar;
}

//-----------------------------------------------------------------
//Regex validation de la ville | [Relié à validation()]
//-----------------------------------------------------------------
const validCity = function validCity(iniVar) {

    let inputName = document.getElementById("city").value;
    //Initialisation du RegExp pour validation du firstName
    let regexNames = new RegExp('^[a-zA-Z\-_]+$', 'g');
    let testRegNames = regexNames.test(inputName);

    // Si le test de validation renvoi false
    if (!testRegNames) {
        // iniVar++;
        let msg = "Veuillez renseigner un nom de ville valide";
        focusSmallCity.textContent = msg;
        msg = styleInvalid(focusSmallCity);
        return false
    } else {
        focusSmallCity.textContent = "";
        return true
    }
    // console.log(testRegNames);
    // return iniVar
}

//-----------------------------------------------------------------
//Regex validation de l'email | [Relié à validation()]
//-----------------------------------------------------------------
function validEmail(iniVar) {
    let inputEmail = document.getElementById("email").value;
    //Initialisation du RegExp pour validation d'email
    let regexEmail = new RegExp('^[a-zA-Z0-9-_\.]+[@]{1}[a-zA-Z0-9-_]+[\.]{1}[a-z]{2,8}$', 'i');
    let testRegEmail = regexEmail.test(inputEmail);

    // Si le test de validation renvoi false
    if (!testRegEmail) {
        // iniVar++;
        let msg = "Veuillez renseigner une email valide"
        focusSmallEmail.textContent = msg;
        msg = styleInvalid(focusSmallEmail);
        return false

    } else {
        focusSmallEmail.textContent = "";
        return true
    }
    // return iniVar
    // console.log(testRegEmail);
    // validationEmail(testRegEmail);
}


//-----------------------------------------------------------------
// Fonction de Validation & Redirection sur la page "Confirmation"
//-----------------------------------------------------------------
function validation() {

    // Ecoute et validation du bouton "Commander"
    COMMAND.addEventListener('click', function (e) {
        e.preventDefault()
        let getFN = document.getElementById("firstName");
        let getLN = document.getElementById("lastName");
        let getAdd = document.getElementById("address");
        let getC = document.getElementById("city");
        let getE = document.getElementById("email");

        // Si le localstorage n'est pas vide
        if (localStorage.length > 0) {

            // let iniVar = 0;

            //Exécution des fonctions de test qui renvois true ou false
            let validInputFN = validFirstName(getFN);
            let validInputLN = validLastName(getLN);
            let validInputADD = validAddress(getAdd);
            let validInputC = validCity(getC);
            let validInputE = validEmail(getE);

            const result = validInputFN && validInputLN && validInputADD && validInputC && validInputE;
            console.log("Ceci est le résultat des tests de validation Regex: " + result);

            /**
             * Si les tests (result) sont true
             * Ou si les champs de validations "input" sont validés
             *  */
            if (result) {
                // *************************
                let getFirst = document.getElementById("firstName").value;
                let getLast = document.getElementById("lastName").value;
                let getAddress = document.getElementById("address").value;
                let getCity = document.getElementById("city").value;
                let getEmail = document.getElementById("email").value;

                let produits = JSON.parse(localStorage.getItem("data")) || [];

                //Itère sur les ID des produits et les places dans un tableau
                const TAB_ID_PRODUCTS = []
                function forIdProducts() {
                    for (let i = 0; i < produits.length; i++) {
                        const getIdProducts = produits[i].id;
                        TAB_ID_PRODUCTS.push(getIdProducts)
                        // console.log(getIdProducts)
                    }
                }
                forIdProducts()
                console.log("Tableau des ID produits: " + TAB_ID_PRODUCTS)
                // forIdProducts()
                // console.log(getFirst)

                // Préparation des données que le backend attend
                const objetContactProduits = {
                    // firstName: 'toto',
                    // lastName: 'bordeau',
                    // address: '2 rue des palmiers',
                    // city: 'paris',
                    // email: 'toto@gmail.com',
                    firstName: getFirst,
                    lastName: getLast,
                    address: getAddress,
                    city: getCity,
                    email: getEmail,
                }
                // * contact: {
                //     *   firstName: string,
                //     *   lastName: string,
                //     *   address: string,
                //     *   city: string,
                //     *   email: string
                //     * }
                const bodyApi = {
                    contact: objetContactProduits,
                    products: TAB_ID_PRODUCTS
                };
                // POST du formulaire client + id produits vers API
                const apiPost = {
                    method: "POST",
                    body: JSON.stringify(bodyApi),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                };
                // console.log(bodyApi);
                //API fetch pour post les données
                fetch("http://localhost:3000/api/products/order", apiPost)
                    .then((res) => res.json())
                    .then(function (data) {
                        //envoie vers la page confirmation avec id de la commande concaténé
                        window.location.href = "confirmation.html?orderId=" + data.orderId;
                        console.log("Données récuperé du fetch: " + data.orderId)

                    }).catch(function (err) {
                        console.log("error");
                    });

            } else {
                e.preventDefault();
                alert("Formulaire mal renseigner.");
            }
        } else {
            e.preventDefault();
            alert("Votre panier est vide.");
        }
    });

}
validation()
//================FIN PAGE PANIER==================//