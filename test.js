const ingredients = [
  { id: "bread", name: "Bread", emoji: "🍞" },
  { id: "cheese", name: "Cheese", emoji: "🧀" },
  { id: "tomato", name: "Tomato", emoji: "🍅" },
  { id: "lettuce", name: "Lettuce", emoji: "🥬" },
  { id: "egg", name: "Egg", emoji: "🥚" },
  { id: "mushroom", name: "Mushroom", emoji: "🍄" },
  { id: "avocado", name: "Avocado", emoji: "🥑" },
  { id: "strawberry", name: "Strawberry", emoji: "🍓" }
];

const orders = [
  {
    name: "Cheesy Tomato Toast",
    description: "A crispy slice with melted cheese and fresh tomato.",
    ingredients: ["bread", "cheese", "tomato"]
  },
  {
    name: "Garden Breakfast Toast",
    description: "Toast topped with a sunny egg and a little green crunch.",
    ingredients: ["bread", "egg", "lettuce"]
  },
  {
    name: "Berry Avocado Snack",
    description: "A surprising sweet-and-creamy toast with fresh berries.",
    ingredients: ["bread", "avocado", "strawberry"]
  }
];

// Game state: the current order, what the player picked, and their points.
let orderIndex = 0;
let score = 0;
let selectedIngredients = [];
let orderIsReady = true;

const scoreElement = document.querySelector("#score");
const titleElement = document.querySelector("#order-title");
const descriptionElement = document.querySelector("#order-description");
const progressElement = document.querySelector("#order-progress");
const ingredientListElement = document.querySelector("#ingredient-list");
const feedbackElement = document.querySelector("#feedback");
const cookButton = document.querySelector("#cook-button");

function renderIngredients() {
  ingredientListElement.innerHTML = "";

  ingredients.forEach((ingredient) => {
    const button = document.createElement("button");
    const isSelected = selectedIngredients.includes(ingredient.id);

    button.className = `ingredient${isSelected ? " selected" : ""}`;
    button.type = "button";
    button.setAttribute("aria-pressed", String(isSelected));
    button.disabled = !orderIsReady;
    button.innerHTML = `
      <span class="ingredient-emoji" aria-hidden="true">${ingredient.emoji}</span>
      <span class="ingredient-name">${ingredient.name}</span>
    `;
    button.addEventListener("click", () => toggleIngredient(ingredient.id));
    ingredientListElement.append(button);
  });
}

function renderOrder() {
  const order = orders[orderIndex];
  titleElement.textContent = order.name;
  descriptionElement.textContent = order.description;

  progressElement.innerHTML = orders.map((_, index) => {
    const status = index < orderIndex ? " done" : index === orderIndex ? " current" : "";
    return `<span class="progress-dot${status}" aria-hidden="true"></span>`;
  }).join("");

  feedbackElement.textContent = "Choose the ingredients in the order to get started.";
  feedbackElement.className = "feedback";
  cookButton.textContent = "🍽️ Make the dish";
}

function toggleIngredient(ingredientId) {
  if (!orderIsReady) return;

  if (selectedIngredients.includes(ingredientId)) {
    selectedIngredients = selectedIngredients.filter((id) => id !== ingredientId);
  } else {
    selectedIngredients.push(ingredientId);
  }

  renderIngredients();
}

function checkOrder() {
  if (!orderIsReady) {
    startNextOrder();
    return;
  }

  const wantedIngredients = orders[orderIndex].ingredients;
  const isCorrect = wantedIngredients.length === selectedIngredients.length
    && wantedIngredients.every((id) => selectedIngredients.includes(id));

  if (!isCorrect) {
    feedbackElement.textContent = "Not quite! Check the order and try changing your ingredients.";
    feedbackElement.className = "feedback try-again";
    return;
  }

  score += 10;
  scoreElement.textContent = String(score);
  orderIsReady = false;
  feedbackElement.textContent = "Perfect recipe! Your customer is going to love it. +10 points!";
  feedbackElement.className = "feedback success";
  cookButton.textContent = orderIndex === orders.length - 1 ? "🎉 See your results" : "➡️ Next customer";
  renderIngredients();
}

function startNextOrder() {
  if (orderIndex === orders.length - 1) {
    titleElement.textContent = "You served everyone!";
    descriptionElement.textContent = `Amazing work in the kitchen. You earned ${score} points!`;
    progressElement.innerHTML = orders.map(() =>
      '<span class="progress-dot done" aria-hidden="true"></span>'
    ).join("");
    feedbackElement.textContent = "Want to cook another round? Refresh the page to play again.";
    feedbackElement.className = "feedback success";
    cookButton.textContent = "Round complete!";
    cookButton.disabled = true;
    return;
  }

  orderIndex += 1;
  selectedIngredients = [];
  orderIsReady = true;
  renderOrder();
  renderIngredients();
}

cookButton.addEventListener("click", checkOrder);
renderOrder();
renderIngredients();

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("Tiny Kitchen could not enable offline support:", error);
    });
  });
}