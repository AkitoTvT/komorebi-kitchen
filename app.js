const h = React.createElement;
const cultureSources = {
  washoku:
    "https://www.maff.go.jp/e/policies/market/washoku-world-challenge/en/learning_01.html",
  table: "https://www.japan.travel/en/guide/japanese-food-etiquette/",
  temperatures:
    "https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures",
};
const stories = [
  {
    title: "One soup, three dishes",
    subtitle: "A little balance, the washoku way",
    label: "AT THE TABLE",
    sections: [
      [
        "A meal, rather than a single plate",
        "Ichijū-sansai is a traditional framework for putting a meal together: rice, soup, and three accompanying dishes, often with pickles. It gives each small dish a place at the table.",
      ],
      [
        "Bring a little variety",
        "Try different cooking methods and textures: something grilled, something gently simmered, and a fresh or dressed vegetable side. It is a useful way to think about variety, rather than a rigid rule for every meal.",
      ],
      [
        "Start with what you have",
        "A bowl of rice, miso soup, tamagoyaki, and a vegetable side is an approachable place to begin. Add another dish when it suits the day.",
      ],
    ],
    source: cultureSources.washoku,
  },
  {
    title: "A few good table manners",
    subtitle: "Small gestures that show a little care",
    label: "FOOD & TRADITION",
    sections: [
      [
        "Before and after a meal",
        "Itadakimasu is commonly said before eating; gochisōsama deshita expresses appreciation afterward. The spirit is gratitude for the food and the people behind it.",
      ],
      [
        "Give your chopsticks a rest",
        "Use a chopstick rest when you can. Avoid leaving chopsticks standing upright in a bowl of rice or passing food directly from one pair of chopsticks to another; both resemble funeral practices.",
      ],
      [
        "Follow your hosts",
        "Dining customs vary by setting. Watch your hosts, be considerate of the people around you, and ask if you are unsure.",
      ],
    ],
    source: cultureSources.table,
  },
  {
    title: "Let the season lead",
    subtitle: "Why the time of year belongs on the plate",
    label: "SEASONAL LIVING",
    sections: [
      [
        "Notice what is good right now",
        "Japanese food culture often gives seasonal ingredients a central role. A small change in the vegetables, garnishes, or serving dishes can make a familiar meal feel different.",
      ],
      [
        "A simple seasonal swap",
        "Try green beans and eggplant in summer tempura, or sweet potato and squash in cooler months. Adjust slice thickness and cooking time to suit each vegetable.",
      ],
      [
        "More than ingredients",
        "Colors, tableware, and presentation can reflect the season too. You do not need elaborate equipment: a few thoughtfully chosen elements are enough.",
      ],
    ],
    source: cultureSources.washoku,
  },
];
function readSaved() {
  try {
    return JSON.parse(localStorage.getItem("komorebi-saved") || "[]");
  } catch {
    return [];
  }
}
function formatAmount(n) {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

// Recipes, filters, and saved dishes all stay in the visitor's browser.
function App() {
  const [category, setCategory] = React.useState("All recipes");
  const [search, setSearch] = React.useState("");
  const [saved, setSaved] = React.useState(readSaved);
  const [savedOnly, setSavedOnly] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [modal, setModal] = React.useState(null);
  const [servings, setServings] = React.useState(2);
  const [checked, setChecked] = React.useState([]);
  const dialogRef = React.useRef(null);
  const lastFocus = React.useRef(null);
  function toggleSave(id) {
    setSaved((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem("komorebi-saved", JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function openRecipe(recipe) {
    setServings(2);
    setChecked([]);
    setModal({ type: "recipe", recipe });
  }
  function browse(c = "All recipes") {
    setCategory(c);
    setSavedOnly(false);
    setSearch("");
    setMenu(false);
    document.getElementById("recipes").scrollIntoView({ behavior: "smooth" });
  }
  function showSaved() {
    setSavedOnly(true);
    setSearch("");
    setCategory("All recipes");
    setMenu(false);
    document.getElementById("recipes").scrollIntoView({ behavior: "smooth" });
  }
  React.useEffect(() => {
    if (!modal) return;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    function key(e) {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const els = dialogRef.current.querySelectorAll(
          "button:not([disabled]),a,input,select",
        );
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", key);
      lastFocus.current?.focus();
    };
  }, [modal]);
  const filtered = recipes.filter(
    (r) =>
      (category === "All recipes" || r.category === category) &&
      (!savedOnly || saved.includes(r.id)) &&
      (
        r.name +
        " " +
        r.jp +
        " " +
        r.intro +
        " " +
        r.ingredients.map((i) => i[2]).join(" ")
      )
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function photoCredit(r) {
    const credit =
      typeof photoCredits !== "undefined"
        ? photoCredits.find((p) => p.id === r.image)
        : null;
    return credit
      ? h(
          "p",
          { className: "photo-credit" },
          "Serving inspiration · ",
          credit.author,
          " · ",
          h(
            "a",
            {
              href: credit.source,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            "Photo source",
          ),
          " · ",
          h(
            "a",
            {
              href: credit.licenseUrl,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            credit.license,
          ),
        )
      : null;
  }
  const r = modal?.recipe;
  return h(
    React.Fragment,
    null,
    h(
      "div",
      { className: "topline" },
      "A LITTLE CURIOSITY. A GOOD MEAL. A TASTE OF JAPAN.",
    ),
    h(
      "div",
      { className: "nav-shell" },
      h(
        "nav",
        { className: "container-xl", "aria-label": "Main navigation" },
        h(
          "a",
          {
            href: "#",
            className: "brand",
            "aria-label": "Komorebi Kitchen home",
          },
          h("span", { className: "stamp", "aria-hidden": true }, "木漏れ日"),
          h("span", null, "komorebi", h("small", null, "the Japanese kitchen")),
        ),
        h(
          "div",
          { className: "navlinks " + (menu ? "open" : "") },
          h(
            "a",
            {
              href: "#recipes",
              onClick: () => {
                setSavedOnly(false);
                setMenu(false);
              },
            },
            "The recipes",
          ),
          h(
            "a",
            { href: "#culture", onClick: () => setMenu(false) },
            "Food & tradition",
          ),
          h(
            "a",
            { href: "#pantry", onClick: () => setMenu(false) },
            "The pantry",
          ),
          h(
            "a",
            { href: "#journal", onClick: () => setMenu(false) },
            "Kitchen notes",
          ),
        ),
        h(
          "div",
          { style: { display: "flex", gap: "10px", alignItems: "center" } },
          h(
            "button",
            { className: "save-nav", onClick: showSaved },
            "♡  My recipes (" + saved.length + ")",
          ),
          h(
            "button",
            {
              className: "menu",
              "aria-label": "Toggle menu",
              "aria-expanded": menu,
              onClick: () => setMenu(!menu),
            },
            menu ? "×" : "☰",
          ),
        ),
      ),
    ),
    h(
      "main",
      null,
      h(
        "div",
        { className: "container-xl" },
        h(
          "header",
          { className: "hero" },
          h(
            "div",
            { className: "hero-copy" },
            h(
              "div",
              { className: "eyebrow" },
              "From our little kitchen to yours",
            ),
            h(
              "h1",
              null,
              "A little Japan,",
              h("br"),
              "at ",
              h("em", null, "your table."),
            ),
            h(
              "p",
              null,
              "Comforting bowls. Familiar favorites. A few new traditions. Come explore the food that makes Japanese cooking so special.",
            ),
            h(
              "div",
              { className: "hero-links" },
              h(
                "a",
                {
                  href: "#recipes",
                  className: "button",
                  onClick: () => setSavedOnly(false),
                },
                "Find your next dish",
                "↗",
              ),
              h(
                "a",
                { href: "#culture", className: "textlink" },
                "A taste of tradition",
              ),
            ),
            h(
              "div",
              { className: "hero-foot" },
              h("span", { className: "sun", "aria-hidden": true }),
              h(
                "span",
                null,
                "15 RECIPES · EVERYDAY INGREDIENTS · A LITTLE CARE",
              ),
            ),
          ),
          h(
            "div",
            { className: "hero-visual" },
            h("img", {
              src: "assets/hero.jpg",
              alt: "Japanese sushi arranged on a ceramic plate",
              fetchPriority: "high",
            }),
            h(
              "span",
              { className: "hero-jp", "aria-hidden": true },
              "いただきます",
            ),
            h(
              "div",
              { className: "hero-caption" },
              h("small", null, "GOOD FOOD BEGINS WITH CURIOSITY"),
              h("h2", null, "Make a little room for Japan."),
            ),
            h(
              "a",
              {
                href: "#recipes",
                className: "hero-badge",
                "aria-label": "Explore the recipes",
              },
              "↗",
            ),
          ),
        ),
        h(
          "div",
          { className: "intro-strip" },
          h("span", null, h("b", null, "15"), " dishes worth knowing"),
          h("span", null, "From comforting classics to little sweet things"),
          h(
            "span",
            { className: "hide-mobile" },
            "Explore · Cook · Come back for seconds",
          ),
        ),
      ),
      h(
        "section",
        { id: "recipes" },
        h(
          "div",
          { className: "container-xl" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("div", { className: "eyebrow" }, "Something good is cooking"),
              h(
                "h2",
                null,
                savedOnly
                  ? "Your little recipe collection."
                  : "What are you craving?",
              ),
            ),
            h(
              "p",
              null,
              "A thoughtful collection of Japanese favorites, with approachable recipes for your own kitchen.",
            ),
          ),
          h(
            "div",
            { className: "controls" },
            h(
              "div",
              { className: "filters", "aria-label": "Recipe categories" },
              ...[
                "All recipes",
                "Noodles",
                "Rice & bowls",
                "Mains",
                "Sides & soup",
                "Sweets",
              ].map((c) =>
                h(
                  "button",
                  {
                    key: c,
                    className: "filter " + (category === c ? "active" : ""),
                    "aria-pressed": category === c,
                    onClick: () => setCategory(c),
                  },
                  c,
                ),
              ),
            ),
            h("input", {
              className: "search",
              type: "search",
              placeholder: "Search dishes or ingredients…",
              "aria-label": "Search dishes or ingredients",
              value: search,
              onChange: (e) => setSearch(e.target.value),
            }),
          ),
          h(
            "div",
            { className: "results-line", "aria-live": "polite" },
            h("span", null, filtered.length + " recipes to explore"),
            savedOnly
              ? h(
                  "button",
                  {
                    className: "save-recipe",
                    onClick: () => setSavedOnly(false),
                  },
                  "Show all recipes →",
                )
              : h("span", null, "Save a favorite with ♡"),
          ),
          h(
            "div",
            { className: "row g-4 recipe-grid" },
            ...filtered.map((recipe) =>
              h(
                "div",
                { key: recipe.id, className: "col-sm-6 col-lg-4" },
                h(
                  "article",
                  { className: "recipe-card" },
                  h(
                    "div",
                    { className: "food-image" },
                    h("img", {
                      src: "assets/" + recipe.image + ".jpg",
                      alt: recipe.name + " — serving inspiration",
                      loading: "lazy",
                    }),
                    h("button", {
                      className: "image-open",
                      "aria-label": "Open " + recipe.name + " recipe",
                      onClick: () => openRecipe(recipe),
                    }),
                    h("span", { className: "tag" }, recipe.category),
                    h(
                      "button",
                      {
                        className:
                          "bookmark " +
                          (saved.includes(recipe.id) ? "saved" : ""),
                        "aria-label":
                          (saved.includes(recipe.id) ? "Unsave " : "Save ") +
                          recipe.name,
                        "aria-pressed": saved.includes(recipe.id),
                        onClick: () => toggleSave(recipe.id),
                      },
                      saved.includes(recipe.id) ? "♥" : "♡",
                    ),
                  ),
                  h(
                    "div",
                    { className: "card-body-custom" },
                    h(
                      "div",
                      { className: "card-meta" },
                      h("span", null, recipe.time + " MIN · " + recipe.level),
                      h("span", null, recipe.jp),
                    ),
                    h(
                      "button",
                      {
                        className: "title-button",
                        onClick: () => openRecipe(recipe),
                      },
                      h("h3", null, recipe.name),
                      h("span", null, "↗"),
                    ),
                    h("p", null, recipe.tag),
                  ),
                ),
              ),
            ),
          ),
          filtered.length === 0
            ? h(
                "div",
                { className: "empty" },
                savedOnly && saved.length === 0
                  ? "Your collection is waiting. Tap a heart on any recipe to save it."
                  : "Nothing here just yet. Try another ingredient or category.",
                h(
                  "div",
                  null,
                  h(
                    "button",
                    {
                      className: "button light",
                      style: { marginTop: "20px" },
                      onClick: () => browse(),
                    },
                    "Browse all recipes",
                    "→",
                  ),
                ),
              )
            : null,
        ),
      ),
      h(
        "section",
        { id: "culture", className: "culture-section" },
        h(
          "div",
          { className: "container-xl culture-layout" },
          h(
            "div",
            { className: "culture-image" },
            h("img", {
              src: "assets/onigiri.jpg",
              alt: "Japanese rice balls, a simple everyday staple",
              loading: "lazy",
            }),
            h(
              "span",
              { className: "culture-label" },
              "SIMPLE INGREDIENTS. A LITTLE INTENTION.",
            ),
          ),
          h(
            "div",
            { className: "culture-copy" },
            h("div", { className: "eyebrow" }, "More than a meal"),
            h("h2", null, "A little tradition.", h("br"), "A lot of heart."),
            h(
              "p",
              null,
              "Japanese food culture makes room for the season, the ingredients, and the people around the table. Sometimes that means a carefully arranged meal. Sometimes, a warm bowl of rice.",
            ),
            h(
              "p",
              null,
              "Get to know washoku, the idea of one soup and three dishes, and the small gestures that make a meal feel considered.",
            ),
            h(
              "button",
              {
                className: "button",
                onClick: () => setModal({ type: "story", index: 0 }),
              },
              "Pull up a seat",
              "↗",
            ),
          ),
        ),
      ),
      h(
        "section",
        { id: "pantry" },
        h(
          "div",
          { className: "container-xl" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h(
                "div",
                { className: "eyebrow" },
                "The small things that make the difference",
              ),
              h("h2", null, "Meet your Japanese pantry."),
            ),
            h(
              "p",
              null,
              "You don’t need everything at once. Start with a few useful ingredients and build from there.",
            ),
          ),
          h(
            "div",
            { className: "pantry-grid" },
            ...[
              [
                "米",
                "Japanese rice",
                "Short-grain rice has the stickiness you want for onigiri and sushi. Rinse and cook it according to the packet.",
              ],
              [
                "出汁",
                "Dashi",
                "A light stock that gives soups and sauces depth. Bonito versions contain fish; kombu–shiitake is a plant-based option.",
              ],
              [
                "味噌",
                "Miso",
                "Fermented soybean paste, with flavors ranging from gentle to robust. Add it off the heat for a fragrant miso soup.",
              ],
              [
                "醤油",
                "Soy sauce & mirin",
                "A savory seasoning and a sweet rice seasoning often used together. Mirin usually contains alcohol; check the label.",
              ],
            ].map(([symbol, name, desc]) =>
              h(
                "div",
                { className: "pantry-item", key: name },
                h(
                  "div",
                  { className: "pantry-symbol", "aria-hidden": true },
                  symbol,
                ),
                h("h3", null, name),
                h("p", null, desc),
              ),
            ),
          ),
          h(
            "p",
            {
              style: {
                fontSize: "10px",
                color: "var(--muted)",
                marginTop: "18px",
              },
            },
            "Check ingredient labels for allergens. Soy sauce often contains wheat; dashi and sauces may contain fish.",
          ),
        ),
      ),
      h(
        "section",
        { id: "journal", style: { paddingTop: 0 } },
        h(
          "div",
          { className: "container-xl journal-layout" },
          h(
            "div",
            { className: "journal-intro" },
            h("div", { className: "eyebrow" }, "Notes from the kitchen"),
            h("h2", null, "Good food has", h("br"), "a story."),
            h(
              "p",
              null,
              "A few things to read while the rice is cooking. Get to know the ideas and traditions behind your next meal.",
            ),
          ),
          h(
            "div",
            null,
            ...stories.map((story, i) =>
              h(
                "button",
                {
                  className: "story",
                  key: story.title,
                  onClick: () => setModal({ type: "story", index: i }),
                },
                h("small", null, "0" + (i + 1)),
                h(
                  "div",
                  null,
                  h("h3", null, story.title),
                  h("p", null, story.subtitle),
                ),
                h("span", { className: "story-arrow" }, "↗"),
              ),
            ),
          ),
        ),
      ),
      h(
        "div",
        { className: "container-xl" },
        h(
          "div",
          { className: "closing" },
          h("div", { className: "eyebrow" }, "No perfect technique required"),
          h("h2", null, "Start with one good dish."),
          h(
            "p",
            null,
            "A bowl of miso soup is a lovely place to begin. The rest can wait until tomorrow.",
          ),
          h(
            "button",
            {
              className: "button",
              onClick: () => openRecipe(recipes.find((r) => r.id === "miso")),
            },
            "Make something comforting",
            "↗",
          ),
        ),
      ),
    ),
    h(
      "footer",
      { className: "container-xl" },
      h(
        "div",
        { className: "footer-top" },
        h(
          "a",
          { className: "brand", href: "#" },
          h("span", { className: "stamp", "aria-hidden": true }, "木漏れ日"),
          h("span", null, "komorebi", h("small", null, "the Japanese kitchen")),
        ),
        h("p", null, "A little curiosity belongs in every kitchen."),
        h(
          "div",
          { className: "footer-links" },
          h(
            "button",
            {
              className: "save-recipe",
              onClick: () => setModal({ type: "about" }),
            },
            "About this kitchen",
          ),
          h(
            "button",
            {
              className: "save-recipe",
              onClick: () => setModal({ type: "credits" }),
            },
            "Sources & credits",
          ),
        ),
      ),
      h(
        "div",
        { className: "footer-bottom" },
        h(
          "span",
          null,
          "© " +
            new Date().getFullYear() +
            " Komorebi Kitchen · A template by Marvin Miranda",
        ),
        h("span", null, "React + Bootstrap · Made for curious cooks"),
        h("a", { href: "#" }, "Back to top ↑"),
      ),
    ),
    modal
      ? h(
          "div",
          {
            className: "shade",
            onClick: (e) => {
              if (e.target === e.currentTarget) setModal(null);
            },
          },
          h(
            "div",
            {
              className:
                "dialog " + (modal.type !== "recipe" ? "article-dialog" : ""),
              role: "dialog",
              "aria-modal": true,
              "aria-labelledby": "dialog-title",
              tabIndex: -1,
              ref: dialogRef,
            },
            h(
              "button",
              {
                className: "close",
                "aria-label": "Close window",
                onClick: () => setModal(null),
              },
              "×",
            ),
            modal.type === "recipe"
              ? h(
                  React.Fragment,
                  null,
                  h(
                    "div",
                    { className: "recipe-heading" },
                    h("img", {
                      src: "assets/" + r.image + ".jpg",
                      alt: r.name + " serving inspiration",
                    }),
                    h(
                      "div",
                      { className: "recipe-heading-copy" },
                      h(
                        "div",
                        { className: "eyebrow" },
                        r.category + " / " + r.time + " MIN",
                      ),
                      h("h2", { id: "dialog-title" }, r.name),
                      h("div", { className: "jp" }, r.jp),
                      h("p", null, r.intro),
                    ),
                  ),
                  h(
                    "div",
                    { className: "recipe-tools" },
                    h(
                      "div",
                      { className: "serving-control" },
                      h("span", null, "Serves"),
                      h(
                        "button",
                        {
                          "aria-label": "Fewer servings",
                          disabled: servings <= 2,
                          onClick: () => setServings(servings - 2),
                        },
                        "−",
                      ),
                      h("strong", { "aria-live": "polite" }, servings),
                      h(
                        "button",
                        {
                          "aria-label": "More servings",
                          disabled: servings >= 8,
                          onClick: () => setServings(servings + 2),
                        },
                        "+",
                      ),
                    ),
                    h(
                      "div",
                      { style: { display: "flex", gap: "17px" } },
                      h(
                        "button",
                        {
                          className: "save-recipe",
                          onClick: () => toggleSave(r.id),
                        },
                        saved.includes(r.id) ? "♥ Saved" : "♡ Save recipe",
                      ),
                      h(
                        "button",
                        {
                          className: "save-recipe",
                          onClick: () => window.print(),
                        },
                        "Print ↗",
                      ),
                    ),
                  ),
                  h(
                    "div",
                    { className: "recipe-content" },
                    h(
                      "div",
                      null,
                      h("h3", null, "What you’ll need"),
                      ...r.ingredients.map(([amount, unit, name], i) =>
                        h(
                          "label",
                          {
                            className:
                              "ingredient " +
                              (checked.includes(i) ? "checked" : ""),
                            key: i,
                          },
                          h("input", {
                            type: "checkbox",
                            checked: checked.includes(i),
                            onChange: () =>
                              setChecked((prev) =>
                                prev.includes(i)
                                  ? prev.filter((x) => x !== i)
                                  : [...prev, i],
                              ),
                          }),
                          h(
                            "span",
                            null,
                            h(
                              "b",
                              null,
                              formatAmount((amount * servings) / 2) +
                                " " +
                                unit +
                                " ",
                            ),
                            name,
                          ),
                        ),
                      ),
                      h(
                        "p",
                        {
                          style: {
                            fontSize: "9px",
                            color: "var(--muted)",
                            marginTop: "15px",
                          },
                        },
                        "Amounts scale with servings; cooking times and oil depth do not. Use a larger pan or cook in batches.",
                      ),
                    ),
                    h(
                      "div",
                      null,
                      h("h3", null, "Let’s make it"),
                      h(
                        "ol",
                        { className: "steps" },
                        ...r.steps.map((step, i) =>
                          h(
                            "li",
                            { key: i },
                            h("b", null, String(i + 1).padStart(2, "0")),
                            h("span", null, step),
                          ),
                        ),
                      ),
                      h(
                        "div",
                        { className: "tip" },
                        h("b", null, "A little kitchen note"),
                        r.tip,
                      ),
                    ),
                  ),
                  h(
                    "div",
                    { className: "recipe-note" },
                    h("h3", null, "A little about the dish"),
                    h("p", null, r.note),
                    h(
                      "p",
                      null,
                      "An approachable home-style version. Timing is approximate; ingredients and equipment vary. Photos are serving inspiration and may show different toppings.",
                    ),
                    photoCredit(r),
                    h(
                      "a",
                      {
                        href: cultureSources.temperatures,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "photo-credit",
                      },
                      "Cooking temperature reference: FoodSafety.gov ↗",
                    ),
                  ),
                )
              : modal.type === "story"
                ? h(
                    React.Fragment,
                    null,
                    h(
                      "div",
                      { className: "eyebrow" },
                      stories[modal.index].label,
                    ),
                    h("h2", { id: "dialog-title" }, stories[modal.index].title),
                    ...stories[modal.index].sections.map(([title, text]) =>
                      h(
                        "div",
                        { key: title },
                        h("h3", null, title),
                        h("p", null, text),
                      ),
                    ),
                    h(
                      "p",
                      null,
                      h(
                        "a",
                        {
                          href: stories[modal.index].source,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        },
                        "Read the cultural reference ↗",
                      ),
                    ),
                  )
                : modal.type === "about"
                  ? h(
                      React.Fragment,
                      null,
                      h("div", { className: "eyebrow" }, "Welcome in"),
                      h(
                        "h2",
                        { id: "dialog-title" },
                        "A kitchen for curious cooks.",
                      ),
                      h(
                        "p",
                        null,
                        "Komorebi Kitchen is a recipe-blog concept with fifteen approachable Japanese dishes, from everyday home cooking to popular comfort foods. The collection is a starting point, rather than a ranking of the best dishes in Japan.",
                      ),
                      h(
                        "p",
                        null,
                        "These are simplified home-style recipes written for this collection, not kitchen-tested recipes. Regional and household versions differ. Check the cooking guidance, use a food thermometer where indicated, and adjust seasonings to your ingredients.",
                      ),
                      h(
                        "p",
                        null,
                        "Save recipes with the heart button and check off ingredients as you cook. Saved dishes stay in this browser; they do not sync between devices.",
                      ),
                    )
                  : h(
                      React.Fragment,
                      null,
                      h(
                        "div",
                        { className: "eyebrow" },
                        "A little credit where it’s due",
                      ),
                      h("h2", { id: "dialog-title" }, "Sources & photography"),
                      h("h3", null, "Food culture"),
                      h(
                        "p",
                        null,
                        h(
                          "a",
                          {
                            href: cultureSources.washoku,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          "Japan’s Ministry of Agriculture: What is Washoku?",
                        ),
                      ),
                      h(
                        "p",
                        null,
                        h(
                          "a",
                          {
                            href: cultureSources.table,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          "Japan National Tourism Organization: Food etiquette",
                        ),
                      ),
                      h(
                        "p",
                        null,
                        h(
                          "a",
                          {
                            href: cultureSources.temperatures,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          "FoodSafety.gov: Cooking temperatures",
                        ),
                      ),
                      h("h3", null, "Photography"),
                      h(
                        "p",
                        null,
                        "Photographs are serving inspiration. The photographed versions may differ from the recipes here.",
                      ),
                      h(
                        "div",
                        { className: "credit-row" },
                        h(
                          "a",
                          {
                            href: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          "Hero sushi photograph — Unsplash",
                        ),
                        " · ",
                        h(
                          "a",
                          {
                            href: "https://unsplash.com/license",
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          "Unsplash License",
                        ),
                      ),
                      ...(typeof photoCredits !== "undefined"
                        ? photoCredits
                        : []
                      ).map((c) =>
                        h(
                          "div",
                          { className: "credit-row", key: c.id },
                          h(
                            "a",
                            {
                              href: c.source,
                              target: "_blank",
                              rel: "noopener noreferrer",
                            },
                            c.id + " — " + c.author,
                          ),
                          " · ",
                          h(
                            "a",
                            {
                              href: c.licenseUrl,
                              target: "_blank",
                              rel: "noopener noreferrer",
                            },
                            c.license,
                          ),
                        ),
                      ),
                    ),
          ),
        )
      : null,
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(h(App));
