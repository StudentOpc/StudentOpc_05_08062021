//================PAGE INDEX==================//

//Déclaration de l'url de l'Api
let api = new URL("http://localhost:3000/api/products");

//-----------------------------------------------------------------
// Appel et traduction de l'api au format json
//-----------------------------------------------------------------
fetch(api)
    .then(response => response.json())
    .then(function (listeproducts) {
        for (let product of listeproducts) {

            //La propriéter new permet d'intégrer un constructeur (voir kanap.js)
            let products = new Kanap(product)
            INDEX(products);
        }
        // console.table(listeproducts)
    })
    .catch(function (error) {
        console.log(error, 'Erreur du fetch Page index')
    });

// Recherche de l'Id "items" sur page Html
let SECTION_CONTENT = document.getElementById('items');


//-----------------------------------------------------------------
// Applique les données de l'api sur l'index HTML
//-----------------------------------------------------------------
const INDEX = products => {
    SECTION_CONTENT.innerHTML += `
    <a class="product-a" href="./product.html?id=${products.id}" >
    <article>
            <img src="${products.imageUrl}" alt"${products.altTxt}"/>
            <h3>${products.name}</h3>
            <p>${products.description}</p>
    </article>
    </a>`
};
//================FIN PAGE INDEX==================//