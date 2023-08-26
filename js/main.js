var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

if (isMobile.any()) {
  document.querySelector("html").classList.add("_touch");
}

window.onload = function () {
  //будет срабатывать,когда весь контент на стр загрузится
  document.addEventListener("click", documentActions);

  // Actions (делегирование события click)
  function documentActions(e) {
    const targetElement = e.target;
    if (window.innerWidth > 768 && isMobile.any()) {
      if (targetElement.classList.contains("menu__arrow")) {
        targetElement.closest(".menu__item").classList.toggle("_hover");
      }
    }
    if (targetElement.classList.contains("search-form__img")) {
      document.querySelector(".search-form").classList.toggle("_active"); //добавляем класс при клике на иконку лупы
    } else if (
      !targetElement.closest(".search-form") &&
      document.querySelector(".search-form._active")
    ) {
      document.querySelector(".search-form").classList.remove("_active"); //убираем класс (форму поиска) по клику на любую область
    }

    if (targetElement.classList.contains("products__more")) {
      getProducts(targetElement);
      e.preventDefault(); //отменяет обычное действие, поскольку это ссылка, стр должна перезагрузиться автоматически (это отменяем)
    }

    if (targetElement.classList.contains("actions-product__button")) {
      const productId = targetElement.closest(".item-product").dataset.pid;
      addToCart(targetElement, productId);
      e.preventDefault();
    }

    if (
      targetElement.classList.contains("cart-header__icon") ||
      targetElement.closest(".cart-header__icon")
    ) {
      if (document.querySelector(".cart-list").children.length > 0) {
        document.querySelector(".cart-header").classList.toggle("_active");
      }
      e.preventDefault();
    } else if (
      !targetElement.closest(".cart-header") &&
      !targetElement.classList.contains("actions-product__button")
    ) {
      document.querySelector(".cart-header").classList.remove("_active");
    }

    if (targetElement.classList.contains("cart-list__delete")) {
      const productId =
        targetElement.closest(".cart-list__item").dataset.cartPid;
      updateCart(targetElement, productId, false); //false- не добавляем товар в корзину,а удаляем
      e.preventDefault();
    }
  }

  // Header (при скролле остается вверху)
  const headerElement = document.querySelector(".header");

  const callback = function (entries, observer) {
    if (entries[0].isIntersecting) {
      headerElement.classList.remove("_scroll");
    } else {
      headerElement.classList.add("_scroll");
    }
  };

  const headerObserver = new IntersectionObserver(callback);
  headerObserver.observe(headerElement);

  //Load More Products
  async function getProducts(button) {
    if (!button.classList.contains("_hold")) {
      button.classList.add("_hold");
      const file = "json/products.json";
      let response = await fetch(file, {
        method: "GET",
      });
      if (response.ok) {
        let result = await response.json();
        loadProducts(result);
        button.classList.remove("_hold");
        button.remove();
      } else {
        alert("Error");
      }
    }
  }

  function loadProducts(data) {
    const productsItems = document.querySelector(".products__items");

    data.products.forEach((item) => {
      const productId = item.id;
      const productUrl = item.url;
      const productImage = item.image;
      const productTitle = item.title;
      const productText = item.text;
      const productPrice = item.price;
      const productOldPrice = item.priceOld;
      const productShareUrl = item.shareUrl;
      const productLikeUrl = item.likeUrl;
      const productLabels = item.labels;

      let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
      let productTemplateEnd = `</article>`;

      let productTemplateLabels = "";
      if (productLabels) {
        let productTemplateLabelsStart = `<div class="item-product__labels">`;
        let productTemplateLabelsEnd = `</div>`;
        let productTemplateLabelsContent = "";

        productLabels.forEach((labelItem) => {
          productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
        });

        productTemplateLabels += productTemplateLabelsStart;
        productTemplateLabels += productTemplateLabelsContent;
        productTemplateLabels += productTemplateLabelsEnd;
      }

      let productTemplateImage = `
        <a href="${productUrl}" class="item-product__image">
         <img class="product__img" src="img/${productImage}" alt="${productTitle}">
        </a>`;

      let productTemplateBodyStart = `<div class="item-product__body">`;
      let productTemplateBodyEnd = `</div>`;

      let productTemplateContent = `
        <div class="item-product__content">
         <h3 class="item-product__title">${productTitle}</h3>
         <div class="item-product__text">${productText}</div>
        </div>`;

      let productTemplatePrices = "";
      let productTemplatePricesStart = `<div class="item-product__prices">`;
      let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
      let productTemplatePricesOld = `<div class="item-product__price_old>Rp ${productOldPrice}</div>`;
      let productTemplatePricesEnd = `</div>`;

      productTemplatePrices = productTemplatePricesStart;
      productTemplatePrices += productTemplatePricesCurrent;
      //ИСПРАВИТЬ
      if (productOldPrice == true) {
        productTemplatePrices += productTemplatePricesOld;
      }
      productTemplatePrices += productTemplatePricesEnd;

      let productTemplateActions = `
        <div class="item-product__actions actions-product">
         <div class="actions-product__body">
          <a href="#" class="actions-product__button btn btn_white">Add to cart</a>
          <a href="${productShareUrl}" class="actions-product__link">
           <img class="action__img" src="img/share.svg" alt="share"/>Share</a>
          <a href="${productLikeUrl}" class="actions-product__link"> <img class="action__img" src="img/like.svg" alt="like"/>Like</a>
         </div>
        </div>
        `;

      let productTemplateBody = "";
      productTemplateBody += productTemplateBodyStart;
      productTemplateBody += productTemplateContent;
      productTemplateBody += productTemplatePrices;
      productTemplateBody += productTemplateActions;
      productTemplateBody += productTemplateBodyEnd;

      let productTemplate = "";
      productTemplate += productTemplateStart;
      productTemplate += productTemplateLabels;
      productTemplate += productTemplateImage;
      productTemplate += productTemplateBody;
      productTemplate += productTemplateEnd;

      productsItems.insertAdjacentHTML("beforeend", productTemplate);
    });
  }

  //Ad to Cart
  function addToCart(productButton, productId) {
    if (!productButton.classList.contains("_hold")) {
      productButton.classList.add("_hold");
      productButton.classList.add("_fly");

      const cart = document.querySelector(".cart-header__icon");
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const productImage = product.querySelector(".item-product__image");

      const productImageFly = productImage.cloneNode(true); //клонирую весь этот объект

      //получаю размеры и координаты картинки
      const productImageFlyWidth = productImage.offsetWidth; //ширина оригинальной картинки
      const productImageFlyHeight = productImage.offsetHeight; //высота
      const productImageFlyTop = productImage.getBoundingClientRect().top; //позиция сверху
      const productImageFlyLeft = productImage.getBoundingClientRect().left; //позиция слева

      productImageFly.setAttribute("class", "_flyImage _ibg");
      productImageFly.style.cssText = `
      left: ${productImageFlyLeft}px;
      top: ${productImageFlyTop}px;
      width: ${productImageFlyWidth}px;
      height: ${productImageFlyHeight}px;
      `;

      document.body.append(productImageFly);

      //отправляю клон в корзину
      //получаю координаты корзины
      const cartFlyLeft = cart.getBoundingClientRect().left;
      const cartFlyTop = cart.getBoundingClientRect().top;
      //клону присваиваю уже новое значение (картинка будет лететь, уменьшаться и исчезать)
      productImageFly.style.cssText = `
      left: ${cartFlyLeft}px;
      top: ${cartFlyTop}px;
      width: 0px;
      height: 0px;
      opacity:0;
      `;

      //выводить товар в корзине тогда, когда клон долетит до нее.
      productImageFly.addEventListener("transitionend", function () {
        if (productButton.classList.contains("_fly")) {
          productImageFly.remove();
          updateCart(productButton, productId);
          productButton.classList.remove("_fly");
        }
      });
    }
  }

  //будет добавлять товары в корзину и удалять
  function updateCart(productButton, productId, productAdd = true) {
    const cart = document.querySelector(".cart-header");
    const cartIcon = cart.querySelector(".cart-header__icon");
    const cartQuantity = cartIcon.querySelector("span");
    const cartProduct = document.querySelector(
      `[data-cart-pid="${productId}"]`
    );
    const cartList = document.querySelector(".cart-list");

    //товар добавляем
    if (productAdd) {
      if (cartQuantity) {
        cartQuantity.innerHTML = ++cartQuantity.innerHTML;
      } else {
        cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
      }

      //при нажатии на корзину будет выпадать список добавленных товаров
      if (!cartProduct) {
        //проверяю,существует ли добавленный товар(если нет, тогда его формирую)
        const product = document.querySelector(`[data-pid="${productId}"]`);
        const cartProductImage = product.querySelector(
          ".item-product__image"
        ).innerHTML;
        const cartProductTitle = product.querySelector(
          ".item-product__title"
        ).innerHTML;
        const cartProductContent = `
      <a href="" class="cart-list__image cart-ibg">${cartProductImage}</a>
      <div class="cart-list__body>
        <a href="" class="cart-list__title">${cartProductTitle}</a>
        <div class="cart-list__quantity">Quantity: <span>1</span></div>
        <a href="" class="cart-list__delete">Delete</a>
      </div>
        `;
        cartList.insertAdjacentHTML(
          "beforeend",
          `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`
        );
      } else {
        //если товар есть
        const cartProductQuantity = cartProduct.querySelector(
          ".cart-list__quantity span"
        );
        cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
      }

      //после всех действий отбираем класс (чтобы один и тот же товар можно было добавить в корзину не один раз)
      productButton.classList.remove("_hold");
    } else {
      const cartProductQuantity = cartProduct.querySelector(
        ".cart-list__quantity span"
      ); //получаю кол-во добавлен. товара в корзину
      cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML; //уменьшаю это кол-во на единицу
      if (!parseInt(cartProductQuantity.innerHTML)) {
        //если результат 0, тогда этот товар удаляю
        cartProduct.remove();
      }

      const cartQuantityValue = --cartQuantity.innerHTML;

      if (cartQuantityValue) {
        //если больше нуля, то изменяю кол-во в кружке над карзиной (в спан)
        cartQuantity.innerHTML = cartQuantityValue;
      } else {
        cartQuantity.remove(); //если товар нет, удаляю спан оттуда
        cart.classList.remove("_active"); //и класс актив у списка (чтобы он закрылся)
      }
    }
  }
};

const menuBtn = document.querySelector(".icon-menu");
const menu = document.querySelector(".menu__body");

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("_active");
});
