const express = require('express');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "heroes.json");


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Helper function to read heroes
async function readHeroes() {
    try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
    } catch (error) {
    return []; // Return empty array if file doesn't exist
    }
    }

    // Helper function to write heroes
async function writeHeroes(heroes) {
    await fs.writeFile(DATA_FILE, JSON.stringify(heroes, null, 2));
    }

    // Initialize empty heroes file
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await writeHeroes([]);
  }
}

initializeDataFile();
// Routes go here...
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.post("/heroes", async (req, res) => {
  try {
    const heroes = await readHeroes();
    const newHero = {
      id: Date.now().toString(),
      superName: req.body.superName,
      realName: req.body.realName,
      superpower: req.body.superpower,
      powerLevel: parseInt(req.body.powerLevel),
      secretIdentity: req.body.secretIdentity === "true",
      createdAt: new Date().toISOString(),
    };
    heroes.push(newHero);
    await writeHeroes(heroes);
    res.status(201).json({
      success: true,
      message: "Hero created successfully!",
      redirectTo: "/heroes",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/heroes", async (req, res) => {
  try {
    const heroes = await readHeroes();
    if (req.accepts("html")) {
      res.render("heroList", { heroes });
    } else {
      res.json({ success: true, count: heroes.length, data: heroes });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
