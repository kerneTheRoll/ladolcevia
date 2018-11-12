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
    slideMove: 1,
    slideMargin: 20,

    enableDrag: true,

    rtl: false,
    pauseOnHover: true,

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
  $("#sub").click(function(e) {
    e.preventDefault();
    alert("titto fermo");
  });
  $("#country").jeoCountrySelect({
    callback: function() {
      $("#country").removeAttr("disabled");
    }
  });
});

$(function() {
  jeoquery.defaultData.userName = "ladolcevia";

  $("#country").jeoCountrySelect({});
  $("#postalCode").jeoPostalCodeLookup({
    countryInput: $("#country"),
    target: $("#postalPlace")
  });
});
