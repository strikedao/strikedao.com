//@format
const config = {
  website: {
    description:
      "StrikeDAO is an experiment on quadratic voting applied to Hito Steyerl’s Strike (2010) video",
    keywords: "Hito Steyerl, Quadratic Voting, Decentralization, art",
    author: "Department of Decentralization, Hito Steyerl, Tim Daubenschütz"
  },
  stills: {
    quantity: 1386,
    perEmail: 25
  },
  questions: [
    {
      title: "Which fruit do you like most?",
      content: `There are many fruit. Tomatos are actually also fruit, since they can be considered berries.`,
      options: [
        {
          name: "Tomatos",
          content: "Tomatoes are fruit lol"
        },
        {
          name: "Bananas",
          content: "obviously bananas are fruit too"
        },
        {
          name: "I like hamsters",
          content: "actually hamsters aren't fruit."
        }
      ]
    },
    {
      title: "What dinosaur is your favorite?",
      content: "Dinosaurs are real; they have small hands a large mouths",
      options: [
        {
          name: "Trex",
          content: "a trex is what an email is to a mail."
        },
        {
          name: "BROntosaurus",
          content: "broooooo..."
        }
      ]
    }
  ]
};

export default config;
