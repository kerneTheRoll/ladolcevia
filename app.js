const Prismic = require("prismic-javascript");
const { RichText, Link } = require("prismic-dom");
const app = require("./config");
const config = require("./prismic-configuration");
const PORT = app.get("port");
const Cookies = require("cookies");
const nodemailer = require("nodemailer");
//Must be at the end so it go through the Prismic middleware because ended up in the final route
const I18N = require("./i18n.json");
//provide a lang parameter in the route
function I18NUrl(urlPart) {
  return `/:lang(${I18N.languages.map(l => l.key).join("|")})${urlPart || ""}`;
}

function I18NConfig(req, options) {
  return Object.assign(options || {}, { lang: req.params.lang });
}

app.listen(PORT, () => {
  // console.log(`Go to browser: http://localhost:${PORT}`);
});

//Middleware catch all request, query Prismic API and configure everything for it
app.use((req, res, next) => {
  //init prismic context
  res.locals.ctx = {
    endpoint: config.apiEndpoint,
    linkResolver: config.linkResolver
  };
  //put RichText Helper from Prismic DOM to simplify convert RichText from json to html
  res.locals.RichText = RichText;
  //put Link helper from Prismic DOM to simplify getting url from link
  res.locals.Link = Link;

  Prismic.api(config.apiEndpoint, {
    accessToken: config.accessToken,
    req
  })
    .then(api => {
      req.prismic = { api };
      //continue spreading request
      console.log(res.pismic);
      next();
    })
    .catch(error => {
      //next with params handle error natively in express
      res.status(404).send(error.message);
    });
});

//middleware to setup prismic profiles
app.use((req, res, next) => {
  const cookies = new Cookies(req, res);
  const profilesSettings = require("./profiles.json") || {};
  res.locals.PrismicProfiles = Object.assign(profilesSettings, {
    current: cookies.get("prismic.profile") || profilesSettings.default
  });
  next();
});

app.use(I18NUrl(), (req, res, next) => {
  res.locals.I18N = Object.assign(I18N, { current: req.params.lang });
  next();
});

//Middleware that query menu in prismic for each GET request
app.use(I18NUrl(), (req, res, next) => {
  req.prismic.api
    .getSingle("menu", I18NConfig(req))
    .then(menu => {
      res.locals.menu = menu;
      next();
    })
    .catch(err => {
      next(`Error getting menu from prismic: ${error.message}`);
    });
});

//redirect / to default language from i18n.json
app.get("/", (req, res, next) => {
  res.redirect(I18N.default);
});

function getHome(req, res, next) {
  req.prismic.api
    .getSingle("homepage", I18NConfig(req))
    .then(home => {
      req.home = home;

      next();
    }, I18NConfig(req))
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
}

function getPremium(req, res, next) {
  req.prismic.api
    .query(
      [Prismic.Predicates.at("document.type", "ingredienti-premium")],
      I18NConfig(req)
    )
    .then(function(response) {
      req.premium = response.results;
      next();
    });
}
function consola(req, res) {
  res.render("homepage", {
    home: req.home,
    current: "home",
    title: "ladolcevia",
    prodotto: req.premium
  });
}
app.get(I18NUrl("/"), getHome, getPremium, consola);
// Route for the homepage

/*
app.get(I18NUrl("/"), (req, res, next) => {
  req.prismic.api
    .getSingle("homepage", I18NConfig(req))
    .then(home => {
      res.render("homepage", { home });
    })
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
}); */

//function helper per prendere tutte le categorie in lista
function getCategory(req, res, next) {
  req.prismic.api
    .getSingle("category", I18NConfig(req))
    .then(home => {
      req.categoria = categoria;
      next();
    })
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
}

//function per renderizzare la pagina richiesta categoria

//function per gestire il routing della richiesta categoria

// Route for pages
app.get(I18NUrl("/page/:uid"), (req, res, next) => {
  const uid = req.params.uid;

  req.prismic.api
    .getByUID("page", uid, I18NConfig(req))
    .then(page => {
      if (!page) res.status(404).send("page not found");
      else res.render("page", { page });
    })
    .catch(error => {
      next(`error when retriving page ${error.message}`);
    });
});
function renderCategoria(req, res) {
  /*  req.prodottoFiglio.forEach(ele => {
    ele.data.ingredienteAbdi.forEach(ele2 => {
      console.log(ele.uid);
      console.log(ele2);
    });
  }); */
  res.render("Categorie", {
    title: "ladolcevia",
    categoria: req.categoria,
    prodottoFiglio: req.prodottoFiglio
  });
}

function cerca_ingredienti(req, res, next) {
  const lunghezza = req.prodottoFiglio.length;
  let indice = 0;
  req.prodottoFiglio.forEach((ele, index) => {
    ele.data.ingredienteAbdi;

    var relatedProducts = ele.data.ingrediente_premium;
    var id = relatedProducts.id != null ? relatedProducts.id : " ";
    req.prismic.api
      .query([Prismic.Predicates.at("document.id", id)])
      .then(function(response) {
        //response is the response object, response.results holds the documents
        indice++;
        ele.data.ingredienteAbdi = response.results;
        //console.log(response.results);
        /*      console.log(
          new Date().getTime() +
            "***************inzio****************************************"
        );
        itera(response.results);
        console.log(
          new Date().getTime() +
            "***************fine****************************************"
        ); */
        if (lunghezza === indice) {
          console.log(lunghezza + "indice = " + indice);
          next();
        }
      })
      .catch(err => {
        next("err" + err);
      });

    /*  if (relatedProducts.id) {
      req.prismic.api
        .getByIDs(relatedProducts.id)
        .then(function(relatedProducts) {
          console.log(relatedProducts);
        });
    } */
  });
}
function getCategoria(req, res, next) {
  const uid = req.params.uid;
  req.prismic.api
    .getByUID("category", uid, I18NConfig(req))
    .then(categoria => {
      if (!categoria) res.status(404).send("page not found");
      else req.categoria = categoria;
      next();
    })
    .catch(error => {
      next(`error when retriving page ${error.message}`);
    });
}

// fetch dei prodotti che hanno la categoria del parametro passato : uid
// io prendo poi l'id del documento e lo vado a fetchare dal mio campo "collegamento a un documento"
function getProdottoSimile(req, res, next) {
  const id = req.categoria.id;

  req.prismic.api
    .query([
      Prismic.Predicates.at("document.type", "prodotto"),

      Prismic.Predicates.at("my.prodotto.categories.link", id)
    ])
    .then(function(response) {
      // response is the response object, response.results holds the documents

      req.prodottoFiglio = response.results;

      next();
    })
    .catch(error => {
      next("error " + error.message);
    });
}

app.get(
  I18NUrl("/categoria/:uid"),
  getCategoria,
  getProdottoSimile,
  cerca_ingredienti,
  renderCategoria
);

/* app.get(I18NUrl("/categoria/:uid"), (req, res, next) => {
  const uid = req.params.uid;

  req.prismic.api
    .getByUID("category", uid, I18NConfig(req))
    .then(categoria => {
      if (!categoria) res.status(404).send("page not found");
      else res.render("Categorie", { categoria: categoria, title: "Prodotti" });
    })
    .catch(error => {
      next(`error when retriving page ${error.message}`);
    });
}); */
// servizi
app.get(I18NUrl("/servizi"), function(req, res, next) {
  req.prismic.api
    .getSingle("servizi", I18NConfig(req))
    .then(servizi => {
      res.render("servizi", { title: "servizi", servizi: servizi });
    })
    .catch(err => {
      next(`error when retriving homepage ${error.message}`);
    });
});

app.get(I18NUrl("/azienda"), (req, res, next) => {
  console.log(req.premium);
  req.prismic.api
    .getSingle("azienda", I18NConfig(req))
    .then(azienda => {
      req.prismic.api
        .query(
          [Prismic.Predicates.at("document.tags", ["showcase"])],
          I18NConfig(req)
        )
        .then(function(response) {
          console.log(response.results);
          res.render("Azienda", {
            azienda: azienda,
            premium: response.results,
            title: "azienda"
          });
        });
    })
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
});

//servizi

function getProdotti(req, res, next) {
  req.prismic.api
    .getSingle("prodotti", I18NConfig(req))
    .then(prodotti => {
      req.prodotti = prodotti;

      next();
    }, I18NConfig(req))
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
}
// contatti
function getContatti(req, res, next) {
  req.prismic.api
    .getSingle("contatti", I18NConfig(req))
    .then(contatti => {
      req.contatti = contatti;

      next();
    }, I18NConfig(req))
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
}
function gestisciEmail(req, res, next) {
  var message = "";
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        type: "OAuth2",
        user: "abdimohamed862992@gmail.com",
        clientId:
          "1002077818722-nuu831na5k4ooukl7k6ktv5on52er09t.apps.googleusercontent.com",
        clientSecret: "8jjiNsSSekwHiGOzXldLPnw3",
        refreshToken:
          "1/OAiMWWIav06OOfgOMmNUz0QJZwnkSweA-i1mmihs3BIBcG5l8ul0lfn7IZ3zx-bJ"
      }
    });
    // bisogna controllare!!!!
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const email = req.body.email;
    const azienda = req.body.azienda;
    const country = req.body.country;
    const cap = req.body.cap;
    const citta = req.body.citta;
    const telefono = req.body.telefono;
    const richiesta = req.body.richiesta;
    const scelta = req.body.scelta;

    // setup email data with unicode symbols
    let mailOptions = {
      to: "abdimohamed862992@gmail.com ", // list of receivers
      subject: "richiesta da parte di " + azienda + " per " + scelta, // Subject line
      text:
        "Buona sera, una richiesta da parte dell'azienda " +
        azienda +
        " a nome di " +
        nome +
        " " +
        cognome +
        " numero di telefono " +
        telefono +
        " la richiesta scritta è " +
        richiesta +
        " effettuata da localita " +
        country +
        " cap " +
        cap +
        " città " +
        citta
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        req.message =
          "non è stato possibile inviare il messaggio, riprovare più tardi";
      } else {
        res.status(200).send({
          message: JSON.stringify(
            "grazie per averci contatto, a breve vi ricontatteremo"
          )
        });
      }

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
}
function renderContatti(req, res) {
  res.render("Contatti", {
    contatti: req.contatti,
    title: "Contatti",
    inviato: req.inviato
  });
}

function renderContattiEmail(req, res) {
  res.send(JSON.stringify(req.message));
}

app.get(I18NUrl("/contatti"), getContatti, renderContatti);
app.post(I18NUrl("/contatti"), getContatti, gestisciEmail);

function getCategorieInServizi(req, res, next) {
  req.prismic.api
    .query(Prismic.Predicates.at("document.type", "category"), {
      lang: req.params.lang,
      orderings: "[my.category.ordinamento]"
    })
    .then(function(response) {
      req.categorie = response.results;
      next();
    });
}
function renderProdotti(req, res) {
  res.render("Prodotti", {
    title: "Prodotti",
    prodotti: req.prodotti,
    categorie: req.categorie
  });
}
app.get(
  I18NUrl("/prodotti"),
  getProdotti,
  getCategorieInServizi,
  renderProdotti
);

//preview
app.get("/preview", (req, res) => {
  const token = req.query.token;
  if (token) {
    req.prismic.api
      .previewSession(token, config.linkResolver, "/")
      .then(url => {
        const cookies = new Cookies(req, res);
        cookies.set(Prismic.previewCookie, token, {
          maxAge: 30 * 60 * 1000,
          path: "/",
          httpOnly: false
        });
        res.redirect(302, url);
      })
      .catch(err => {
        res.status(500).send(`Error 500 in preview: ${err.message}`);
      });
  } else {
    res.send(400, "Missing token from querystring");
  }
});
