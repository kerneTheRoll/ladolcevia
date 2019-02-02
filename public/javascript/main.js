$(document).ready(function() {
  var mylingua = localStorage.getItem("language");
  var url = localStorage.getItem("url");

  if (mylingua === null) {
    mylingua = "It";
  }
  jeoquery.defaultData.userName = "ladolcevia";

  $("#country").jeoCountrySelect({});
  $("#postalCode").jeoPostalCodeLookup({
    countryInput: $("#country"),
    target: $("#postalPlace")
  });
  $("#dropdownMenuButton").text(mylingua);
  console.log(url);
  var getDispositivo = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? true
    : false;
  if (getDispositivo) {
    $(".menu").on("touchstart", function() {
      var flagVisibile =
        document.getElementById("listamenu").style.display === "block"
          ? "none"
          : "block";
      $("#listamenu").css("display", flagVisibile);
    });
  } else {
    $(".menu").click(function() {
      var flagVisibile =
        document.getElementById("listamenu").style.display === "block"
          ? "none"
          : "block";
      $("#listamenu").css("display", flagVisibile);
    });
  }

  $(window).resize(function() {
    if ($(document).width() > 767) {
      $("#listamenu").css("display", "block");
      console.log("on resize");
    }
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
      '<span class="custom-prev"><img src="../images/next.png"  style="transform:rotate(-180deg)"/></span>',
    nextHtml:
      '<span class="custom-prev"><img src="../images/next.png" /></span>',
    pager: false
  });
  $(".dropdown-menu a ").click(function(e) {
    var lingua = $(this).attr("data-lingua");
    var url = $(this).attr("data-href");
    localStorage.setItem("language", lingua);
    localStorage.setItem("url", url);
    $("#dropdownMenuButton").text(lingua);
  });
  $(".language-selector select").on("change", function(event) {
    const $select = $(this);
    const $option = $select.find("option:selected", this);
    const url = $option.attr("data-lingua");
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
  $(".apri").click(function(e) {
    e.preventDefault();
    //$(".overl").toggleClass("overl-active");
    $(this)
      .parent()
      .next()

      .toggleClass("overl-active");
    if ($(".overl").hasClass("overl-active")) {
      $(this)
        .parent()
        .parent()
        .parent()
        .toggleClass("overl-active");
    }
  });

  /** funzione per select languiage */

  /*******fine funzione********** */
});

/**guarda sotto e togli i commetni serve per le api delle citta  */

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

      
      // qui va bene
    },

    messages: {
      nome: {
        required: traduciErrori("nome", language),
        minlength: "nome troppo corto, minimo 4 lettere",

      },

      cognome: {
        required: traduciErrori("cognome", language),
        minlength: "cognome troppo corto, minimo 4 lettere",
        required:"Campo obbligatorio"
      },
      email: {
        required: "Campo obbligatorio",
        email: "Campo Obbligatorio"
      },
      country: {
        required: "Campo obbligatorio"
      },
      cap: {
        required: "Campo obbligatorio"
      },
      citta: {
        required: "Campo obbligatorio",
        minlength: "Campo obbligatorio"
      },
      telefono: {
        required: "Campo obbligatorio",
        number: "*Campo obbligatorio"
      },
      richiesta: {
        required: "scrivi un messaggio"
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
      return "Campo obbligatorio   ";
    }
    if (language === "de-de") {
      return "Pflichtfeld";
    }
  }
}
