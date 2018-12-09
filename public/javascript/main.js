$(document).ready(function() {
  $(window).resize(function() {
    if ($(document).width() > 767) {
      $("#listamenu").css("display", "block");
      console.log("on resize");
    }
  });
  $(".menu").click(function() {
    var flagVisibile =
      document.getElementById("listamenu").style.display === "block"
        ? "none"
        : "block";
    $("#listamenu").css("display", flagVisibile);

    console.log(flagVisibile + " " + $(window).width());
  });
  $("#image-slider").lightSlider({
    gallery: false,
    auto: true,
    item: 1,
    loop: true,
    slideMargin: 0,
    controls: false,
    enableDrag: false,
    currentPagerPosition: "left",
    pauseOnHover: true,
    pause: 6000
  });
  $("#slide").lightSlider({
    gallery: false,

    item: 1,

    slideMargin: 90,

    enableDrag: true,

    rtl: false,
    pauseOnHover: true,
    addClass: "center-thumbs",
    controls: true,
    prevHtml:
      '<span class="custom-prev"><img src="http://www.iconninja.com/files/1017/102/406/navigate-right-icon.png"  style="transform:rotate(-180deg)"/></span>',
    nextHtml:
      '<span class="custom-prev"><img src="http://www.iconninja.com/files/1017/102/406/navigate-right-icon.png"  /></span>',
    pager: false
  });

  $(".language-selector select").on("change", function(event) {
    const $select = $(this);
    const $option = $select.find("option:selected", this);
    const url = $option.attr("href");
    window.location.href = url;
  });

  //profiles
  var PROFILE_COOKIE = "prismic.profile";
  function setProfile(profile) {
    window.Cookies.setItem(PROFILE_COOKIE, profile);
  }
  if (!Cookies.hasItem(PROFILE_COOKIE))
    setProfile(window.PrismicProfiles.default);

  $(".profile-selector select").on("change", function(event) {
    console.log(this);
    const $select = $(this);
    const $option = $select.find("option:selected", this);
    const profile = $option.attr("value");
    setProfile(profile);
    window.location.reload();
  });
  $("#card").flip({
    trigger: "manual"
  });
  $("#card1").flip({
    trigger: "manual"
  });
  $("#card2").flip({
    trigger: "manual"
  });

  var event = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? false
    : true;

  console.log(event);
  if (event) {
    // caso è mobile
    $("#card").hover(function() {
      $(this).flip("toggle");
    });
    $("#card1").hover(function() {
      $(this).flip("toggle");
    });

    $("#card2").hover(function() {
      $(this).flip("toggle");
    });
  } else {
    //caso desktop

    $("#card").on("touchstart", function() {
      $(this).flip("toggle");
    });
    $("#card1").on("touchstart", function() {
      $(this).flip("toggle");
    });

    $("#card2").on("touchstart", function() {
      $(this).flip("toggle");
    });
  }
  validaContatti();
  //prova();
});

$(function() {
  jeoquery.defaultData.userName = "ladolcevia";

  $("#country").jeoCountrySelect({});
  $("#postalCode").jeoPostalCodeLookup({
    countryInput: $("#country"),
    target: $("#postalPlace")
  });
});

function validaContatti() {
  var language = $("#language").val();
  $("#contatta").validate({
    highlight: function(element) {
      $(element).addClass("is-invalid");
    },
    unhighlight: function(element) {
      $(element).removeClass("is-invalid");
    },
    rules: {
      nome: {
        required: true,
        minlength: 4
      },
      cognome: {
        required: true,
        minlength: 4
      },
      email: {
        required: true,
        email: true
      },
      azienda: {
        required: true
      },
      country: {
        required: true
      },
      cap: {
        required: true
      },
      citta: {
        required: true,
        minlength: 2
      },
      telefono: {
        required: true,
        number: true
      },

      richiesta: {
        required: function(elem) {
          return $("#scelta option:selected").val() === "niente";
        }
      }
      // qui va bene
    },

    messages: {
      nome: {
        required: traduciErrori("nome", language),
        minlength: "nome troppo corto, minimo 4 lettere"
      },

      cognome: {
        required: traduciErrori("cognome", language),
        minlength: "cognome troppo corto, minimo 4 lettere"
      },
      email: {
        required: "perfavore, inserisci la tua email",
        email: "perfavore, inserisci una email valida"
      },
      azienda: {
        required: "perfavore, inserisci nome dell' azineda"
      },
      country: {
        required: "perfavore, seleziona il tuo stato"
      },
      cap: {
        required: "perfavore,inserisci il tuo cap"
      },
      citta: {
        required: "perfavore, inserisci la tua città",
        minlength: "perfavore, inserisci nome di città valida "
      },
      telefono: {
        required: "perfavore, inserisci numero di telefono",
        number: "perfavore, inserisci solo numeri"
      },
      richiesta: {
        required: "perfavore, scrivici  tua richiesta oppure seleziona sopra"
      }
    },
    submitHandler: function(form) {
      $.ajax({
        url: form.action,
        type: form.method,
        data: $(form).serialize(),
        success: function(response) {
          $("#answers")
            .slideDown()
            .html(response.message);
        }
      });
    }
  });
  $("#content")
    .on("change keyup keydown paste cut", "textarea", function() {
      $(this)
        .height(0)
        .height(this.scrollHeight);
    })
    .find("textarea")
    .change();
}
//gestione traduzione errori @nome campo  @ lingua
// return errore tradotto
function traduciErrori(campo, language) {
  if (campo === "nome") {
    if (language === "it-it") {
      return "Perfavore inserisci il tuo nome ";
    }
    if (language === "de-de") {
      return " ktakejhs sjjsjsj";
    }
  }
  if (campo === "cognome") {
    if (language === "it-it") {
      return "Perfavore inserisci il tuo cognome ";
    }
    if (language === "de-de") {
      return " ktakejhs sjjsjsj";
    }
  }
}
