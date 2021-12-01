//@format
const config = {
  website: {
    description:
      "StrikeDAO is an experiment on quadratic voting applied to Hito Steyerl’s Strike (2010) video",
    keywords: "Hito Steyerl, Quadratic Voting, Decentralization, art",
    author: "Department of Decentralization, Hito Steyerl, Tim Daubenschütz"
  },
  stills: {
    quantity: 693,
    perEmail: 10
  },
  questions: [
    {
      title: "Which fruit do you like most?",
      content: `There are many fruit. Tomatos are actually also fruit, since they can be considered berries.`,
      options: [
        {
          content: "Tomatos"
        },
        {
          content: "Bananas"
        },
        {
          content: "I like hamsters"
        }
      ]
    },
    {
      title: "What dinosaur is your favorite?",
      content: "Dinosaurs are real; they have small hands a large mouths",
      options: [
        {
          content: "Trex"
        },
        {
          content: "BROntosaurus"
        }
      ]
    }
  ]
};

export default config;
