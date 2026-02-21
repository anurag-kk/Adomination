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
  "She won the 'New Artist of the Year' award at the 63rd Japan Record Awards.",
  "Her autobiography 'Vivarium' describes her recording closet as a 'box garden' where she found her identity.",
  "She wrote and composed the song 'Vivarium' as a self-portrait to accompany her book release.",
  "In 'Vivarium', she candidly discusses her past as a truant student and her struggles with self-denial.",
  "She became the first female solo artist to headline the Japan National Stadium with her 2024 'Shinzou' concerts.",
  "The cover art for the single 'Vivarium' features her real-life silhouette, her first physical appearance on a cover.",
  "She produced the 'retro-horror' idol group Phantom Siita, who debuted in 2024.",
  "Her 2025 'Hibana' world tour was the largest-scale global tour ever conducted by a Japanese solo artist.",
  "She collaborated with Imagine Dragons on a remix of their track 'Take Me to the Beach' in late 2024.",
  "During her 'Shinzou' live performance, she realized a dream by performing a duet with Hatsune Miku.",
  "Her second studio album title 'Zanmu' (2024) translates to 'unfulfilled dreams' or 'lingering dreams'."
];

export const generateAdoFunFact = async (): Promise<string> => {
  // Simulate a small network delay for the UI loading effect
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const randomIndex = Math.floor(Math.random() * ADO_FACTS.length);
  return ADO_FACTS[randomIndex];
};