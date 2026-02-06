// Hardcoded list of facts to replace the AI generation
const ADO_FACTS = [
  "Ado started her career as an 'utaite' covering songs on Niconico.",
  "Her stage name comes from the supporting role 'Ado' in Kyogen theater.",
  "She provided the singing voice for Uta in 'One Piece Film: Red'.",
  "Her debut single 'Usseewa' peaked at number 1 on Billboard Japan Hot 100.",
  "She records most of her songs inside a closet in her home to dampen sound.",
  "Ado has never revealed her face publicly, maintaining total anonymity.",
  "She was only 17 years old when her hit 'Usseewa' was released.",
  "Her vocal range allows her to switch between growls and falsettos instantly.",
  "She became the first female solo artist to have three songs in the top 10 simultaneously.",
  "Ado is a huge fan of Vocaloid producers like cloudy weather.",
  "She collaborated with K-pop group LE SSERAFIM for the track 'UNFORGIVEN'.",
  "Her first live concert was performed entirely as a silhouette behind a screen.",
  "The blue rose is often associated with her aesthetic, symbolizing 'miracle'.",
  "She won the 'New Artist of the Year' award at the 63rd Japan Record Awards."
];

export const generateAdoFunFact = async (): Promise<string> => {
  // Simulate a small network delay for the UI loading effect
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const randomIndex = Math.floor(Math.random() * ADO_FACTS.length);
  return ADO_FACTS[randomIndex];
};