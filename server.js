const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();

mongoose.connect(
  process.env.MONGODB_URI || " mongodb://localhost/urlShortener",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res, next) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls });
});

app.post("/shortUrls", async (req, res, next) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

app.get("/:shortUrl", async (req, res, next) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) {
      return res.sendStatus(404);
    } else {
      shortUrl.clicks++;
      shortUrl.save();
      res.redirect(shortUrl.full);
    }
  } catch (err) {
    next(err);
  }
});

app.listen(process.env.PORT || 5000);
