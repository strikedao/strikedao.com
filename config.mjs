//@format
const config = {
  website: {
    description:
      "StrikeDAO is an experiment on quadratic voting applied to Hito Steyerl’s Strike (2010) video",
    keywords: "Hito Steyerl, Quadratic Voting, Decentralization, art",
    author: "Department of Decentralization, Hito Steyerl, Tim Daubenschütz"
  },
  eventData: {
    voteBegin: "2022-03-09T16:36:03.095Z"
  },
  stills: {
    quantity: 2772,
    perEmail: 25
  },
  questions: [
    {
      title: "What seems suited for the future of Bundeskunsthalle?",
      content: "",
      options: [
        {
          name: "Status Quo",
          content: `Bundeskunsthalle: The team of Bundeskunsthalle itself, who will suggest running it as a public institution in the legacy sense, i.e. a mixed governance structure funded by tax money; partly democratically controlled but mostly in the hands of experts, curators and committees.`
        },
        {
          name: "There’s No Such Thing As Disintermediation",
          content: `Department of Decentralization: DoD will argue for a modified DAO governance structure – not taking out the mediators - but subdividing the DAO in special task forces for different problems, each of the task forces collecting and curating proposals, as well as adding their “expert recommendations” to present to the DAO representatives. This proposal is in part, inspired by the Polkadot Governance structure. The goal is to critique through this gesture, the different subgroups of the blockchain ecosystem advocating for no mediation, or on the other side of the spectrum, arguing on-chain governance is a perfect solution.`
        },
        {
          name: "Beyond Public Accountability",
          content: `Other Internet: The Ethereum Name Service (ENS) can be read as a global catalog of economic relationships. A space of absolute transparency is a constraint as well as an opportunity to go beyond public accountability. To shape the museum’s financial flows as a form of curation. In a world of financially addressable objects, what unexpected arrangements of artists, institutions, and publics might emerge? We envision a new role for museums: continuously modeling a more constructive relationship with their own communities.`
        }
      ]
    }
  ]
};

export default config;
