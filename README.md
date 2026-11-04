# Komorebi Kitchen — Let's get it running

Hey, here's your Japanese food-blog template!

It comes with 15 recipes, real food photos, ingredient lists, cooking steps, and a few short reads about Japanese food traditions. You can change the name, colors, content, and photos to fit your own brand.

## Have a quick look

1. Extract the ZIP.
2. Open the `website` folder.
3. Double-click `index.html`.

For editing, I'd suggest opening the folder in VS Code and using Live Server on `index.html`. You can also run this inside the website folder if you have Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Some computers use `python3` instead of `python`.

No npm installation, API key, or build command is needed.

## Where to change things

| File | What's inside |
| --- | --- |
| `website/recipes.js` | All 15 dishes, ingredient amounts, cooking steps, and dish notes |
| `website/app.js` | The page, search, filters, recipe windows, and food-culture articles |
| `website/style.css` | Colors, fonts, spacing, responsive layout, and print styles |
| `website/index.html` | The browser tab title, page description, and script links |
| `website/credits.js` | Photo authors, sources, and licenses |
| `website/assets/` | The photos, React, ReactDOM, and Bootstrap |

Start with the colors in `:root` near the top of `style.css`. For recipes, follow the format of the existing entries in `recipes.js`. Ingredient amounts are written for two servings; the recipe window scales them for the visitor.

The React code uses `React.createElement`, shortened to `h`, so you can edit it directly without setting up JSX or a build tool.

Replace the Komorebi Kitchen name and Marvin Miranda template credit when you add your own branding. Keep the third-party photo and library credits.

## What's included

- Fifteen home-style recipes with quantities and four cooking steps each
- Filters for noodles, rice and bowls, mains, sides and soup, and sweets
- Search by dish name or ingredient
- Saved recipes and ingredient checklists
- Serving controls for two, four, six, or eight people
- A print button in each recipe window
- A pantry guide and three short food-culture articles

Favorites stay in the visitor's browser. They don't sync between devices. Ingredient checklists reset when a recipe is reopened. This is a static website, so it doesn't include user accounts, a CMS, or a newsletter backend.

## Upload your site

Upload everything inside `website/` to your host's publish folder. Keep `index.html`, `app.js`, `recipes.js`, `credits.js`, `style.css`, and `assets/` together.

Choose static-file hosting. There's no build command for this version. Your hosting settings decide whether visitors can access it.

## Recipe and photo notes

These are approachable home-style versions written for this collection, not kitchen-tested recipes. Check the recipes in your own kitchen before marketing them as tested. Cooking times are estimates; serving changes may need a bigger pan or separate batches. Use the temperature guidance in the recipe steps.

Photos show serving inspiration. Toppings, fillings, and preparations may differ from the written version. For example, the tempura photo includes seafood, and the ochazuke photo shows an eel variation.

React, Bootstrap, and the photos are included locally. The fonts load through Google Fonts; a regular serif or sans-serif font takes over offline.

## Credits

Keep `THIRD-PARTY-NOTICES.md` with the template. Each photo has its own license, and the source links are also shown on the website. If you replace a photo, update its entry in `credits.js` too.

I'd suggest changing the branding first, checking a recipe on your phone, then uploading when you're happy with it.
