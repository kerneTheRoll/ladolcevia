var PrismicDOM = require("prismic-dom");

var Elements = PrismicDOM.RichText.Elements;

module.exports = {
  apiEndpoint: "https://altroancora.prismic.io/api/v2",

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver: function(doc, ctx) {
    if (doc.type == "page") return `/${doc.lang}/page/${doc.uid}`;
    if (doc.type == "category") return `/${doc.lang}/categoria/${doc.uid}`;
    if (doc.type == "homepage") return `/${doc.lang}`;
    if (doc.type == "azienda") return `/${doc.lang}/azienda`;
    if (doc.type == "prodotti") return `/${doc.lang}/prodotti`;
    if (doc.type == "servizi") return `/${doc.lang}/servizi`;
    if (doc.type == "contatti") return `/${doc.lang}/contatti`;
    return "/";
  },

  // -- HTML Serializer
  // This function will be used to chnage the way the html is loaded

  htmlSerializer: function(type, element, content, children) {
    switch (type) {
      // Add a class to paragraph elements
      case Elements.paragraph:
        return '<p class="storia py-2">' + children.join("") + "</p>";

      // Don't wrap images in a <p> tag
      case Elements.image:
        return `<div class="container-fluid"><img src='${
          element.url
        }' class="img-resposive"/></div>`;

      // Add a class to hyperlinks
      case Elements.hyperlink:
        var target = element.data.target
          ? 'target="' + element.data.target + '" rel="noopener"'
          : "";
        var linkUrl = PrismicDOM.Link.url(element.data, linkResolver);
        return (
          '<a class="some-link"' +
          target +
          ' href="' +
          linkUrl +
          '">' +
          content +
          "</a>"
        );

      // Return null to stick with the default behavior for all other elements
      default:
        return null;
    }
  }
};
