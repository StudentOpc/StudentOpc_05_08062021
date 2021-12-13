//================PAGE CONFIRMATION==================//
function main() {
  // recuperation element url
  const url = new URL(window.location.href);
  // implémentation id commande dans ID : orderid
  document.getElementById("orderId").innerHTML = url.searchParams.get("orderId");
  // suppression clé localstorage
  localStorage.clear();
}

main()
//================FIN PAGE CONFIRMATION==================//