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
  }
};
