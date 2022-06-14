"use strict;"

fetchProducts();

// To fetch list of products from makeup API and display them
async function fetchProducts(products) {
  try {
    const container = document.querySelector(".container");
    const loader = document.querySelector("#loading");

    if (!products) {
      sessionStorage.clear();
      loader.classList.add("display");

      const data = await fetch(
        "https://makeup-api.herokuapp.com/api/v1/products.json"
      );
      products = await data.json();

      loader.classList.remove("display");
    }

    let currentPage = sessionStorage.getItem("currentPage");
    if (!currentPage) {
      currentPage = 1;
      sessionStorage.setItem("currentPage", currentPage);
    }

    products
      .slice((currentPage - 1) * 9, currentPage * 9)
      .forEach((product) => {
        const card = `
          <div class="card">
            <img class="product-image" src='${product["api_featured_image"]}' alt='${product["name"]}'>
            <div class="card-content">
              <p class="product-brand">${product["brand"]}</p>
              <h3 class="product-name">${product["name"]}</h3>
              <div class="product-description"><p>${product["description"]}</p></div>
              <div class="card-footer">
                <p class="product-price">${product["price"]}</p>
                <a class="button" href='${product["product_link"]}' target="_blank">BUY</a>
              </div>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", card);

        const cardEventListener = document
          .querySelector(".card:last-child")
          .addEventListener("click", function () {
            showModal(product);
          });

        const button = document.querySelector(".card:last-child .button");
        button.onclick = (event) => {
          event.stopPropagation();
          return true;
        };
      });

    const navigation = document.createElement("div");
    navigation.className = "navigation";

    const previous = document.createElement("button");
    previous.classList.add("button", "previous");
    previous.innerHTML = "« Previous";
    previous.addEventListener("click", function () {
      previousPage(products);
    });

    const next = document.createElement("button");
    next.classList.add("button", "next");
    next.innerHTML = "Next »";
    next.addEventListener("click", function () {
      nextPage(products);
    });

    navigation.append(previous, next);
    document.body.append(navigation);
  } catch (error) {
    console.log("Reloading Page. Error occurred: " + error);
    location.reload();
  }
}

// To move to next page
function nextPage(products) {
  const next = document.querySelector(".next");
  const currentPage = Number(sessionStorage.getItem("currentPage"));
  const totalPages = Math.ceil(products.length / 9);

  if (currentPage < totalPages) {
    clearPage();

    sessionStorage.setItem("currentPage", currentPage + 1);
    fetchProducts(products);
    topFunction();
  } else {
    disableButton(next);
  }
}

// To move to previous page
function previousPage(products) {
  const previous = document.querySelector(".previous");
  const currentPage = Number(sessionStorage.getItem("currentPage"));

  if (currentPage > 1) {
    clearPage();

    sessionStorage.setItem("currentPage", currentPage - 1);
    fetchProducts(products);
    topFunction();
  } else {
    disableButton(previous);
  }
}

// To clear the container and remove navigation buttons
function clearPage() {
  const container = document.querySelector(".container");
  const navigation = document.querySelector(".navigation");

  container.innerHTML = "";
  navigation.remove();
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// To disable hover effect and changes opacity of button element
function disableButton(button) {
  button.style.pointerEvents = "none";
  button.style.opacity = "0.4";
}

// To pop up the modal on screen
function showModal(product) {
  const backdrop = document.querySelector(".backdrop");
  const modalElement = `
    <div class="modal">
      <button class="modal-close">X</button>
      <div class="modal-product-image">
        <img src='${product["api_featured_image"]}' alt='${product["name"]}'>
      </div>
      <div class="modal-product-info">
        <p class="product-brand">${product["brand"]}</p>
        <h1 class="product-name">${product["name"]}</h1>
        <p class="product-description">${product["description"]}</p>
        <div class="modal-footer">
          <h1 class="product-price">${product["price"]}</h1>
          <a href='${product["product_link"]}' target="_blank" class="button">BUY</a>
        </div>
      </div>
    </div>`;

  backdrop.insertAdjacentHTML("afterend", modalElement);

  const modal = document.querySelector(".modal");
  const modalCloseEventListener = document.querySelector(".modal-close");

  backdrop.classList.add("display");
  modal.classList.add("display");

  backdrop.addEventListener("click", closeModal);
  modalCloseEventListener.addEventListener("click", closeModal);
}

// To close the modal on screen
function closeModal() {
  const backdrop = document.querySelector(".backdrop");
  const modal = document.querySelector(".modal");

  backdrop.classList.remove("display");
  modal.remove();
}
