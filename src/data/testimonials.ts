export interface Review {
  id: string;
  name: string;
  title: string;
  quote: string;
  /** Path under public/images */
  avatar: string;
}

export interface Shoutout {
  id: string;
  text: string;
  /** Whether the original shows the text wrapped in quotation marks. */
  quoted: boolean;
}

export type MarqueeItem = { kind: 'review'; review: Review } | { kind: 'shoutout'; shoutout: Shoutout };

export const reviews: Review[] = [
  {
    id: 'deanna-meador',
    name: 'Deanna Meador',
    title: 'CEO at Couture, Wondry - Dep. Director',
    quote:
      'I had the pleasure of working with Harsha on an edtech project. He is a strong team leader that shares his knowledge with others in an effective and collaborative way. He is extremely responsive, conscientious, and learns new technologies quickly. I really valued him as a team member and greatly enjoyed working with him. I would love to have him on any technology project I undertake in the future.',
    avatar: 'reviews/deanna-meador.webp',
  },
  {
    id: 'nathan-watkins',
    name: 'Nathan Watkins',
    title: 'Principal Engineer at UnityAI',
    quote:
      'My team worked with Harsha to implement GraphQL to enable our developers and other teams within our org. He brought technical expertise and strong business perspective to steer us toward a solution that met our needs. Harsha delivered a completed implementation that fit seamlessly within our architecture, including a transition plan outlining next steps. I would not hesitate to work again with Harsha in other endeavors.',
    avatar: 'reviews/nathan-watkins.webp',
  },
  {
    id: 'justin-riggs',
    name: 'Justin Riggs',
    title: 'Director of IT Engineering - Health Connect America',
    quote:
      'I worked with Harsha on several high profile development projects for our organization. Harsha was very timely in his responses to our requests, available for troubleshooting, and made several recommendations that improved the product. He was graceful under extreme pressure, and resolved issues quickly. I would definitely be happy to work with Harsha again, and would recommend him wholeheartedly.',
    avatar: 'reviews/justin-riggs.webp',
  },
  {
    id: 'adam-duff',
    name: 'Adam Duff',
    title: 'CTO at InRev',
    quote:
      "I had the pleasure of working with Harsha as he built the MVP of our company's client facing web application. Harsha took complete ownership of the product and deeply cared his work. He worked extremely hard and seamlessly adjusted to the constantly fluctuating roadmap and requirements of an MVP. He also frequently thought outside the box to suggest alternative solutions to technical challenges. All of these things were crucial to our product's success.\n\nOn top of all of this, Harsha is just a great guy. We loved working with Harsha.",
    avatar: 'reviews/adam-duff.webp',
  },
  {
    id: 'jorge-cortell',
    name: 'Jorge Cortell',
    title: 'Harvard Innovation Advisor',
    quote:
      'Sri Harsha is a hard working and bright developer, who can tackle challenges and plays well in a team environment.',
    avatar: 'reviews/jorge-cortell.webp',
  },
  {
    id: 'kyle-ferrio',
    name: 'Kyle Ferrio',
    title: 'CTO at ALAE Technologies',
    quote:
      'Harsha is a strong, experienced developer who overcomes challenges and delivers quality. During a recent project with a firm deadline, he delivered iOS and Android solutions on a tight deadline, proactively improving our build and deployment process along the way. I enjoy working with Harsha and would engage his talent again.',
    avatar: 'reviews/kyle-ferrio.webp',
  },
];

export const shoutouts: Shoutout[] = [
  { id: 's1', text: "Just a fantastic teammate. Communicative, thoughtful, doesn't get too focused on what they're doing and miss the bigger picture.", quoted: true },
  { id: 's2', text: 'Harsha is just an outstanding engineer. He interfaces with the client in a not too technical way, demos and provides information, and is just an overall pleasant person to work with.', quoted: true },
  { id: 's3', text: "Crushing everyone's expectations (including his own) wrapping up the last feature pre-launch!", quoted: true },
  { id: 's4', text: 'First client telehealth appt went off without a hitch! Hard work payed off', quoted: false },
  { id: 's5', text: 'Being an awesome contributor and keeping your head up amongst client pressure', quoted: false },
  { id: 's6', text: 'Sounds like you have been a great mentor to the interns', quoted: false },
];

/** Same interleaving as the Framer marquee: reviewer card, then that reviewer's shout-out. */
export const marqueeItems: MarqueeItem[] = reviews.flatMap((review, i) => [
  { kind: 'review' as const, review },
  { kind: 'shoutout' as const, shoutout: shoutouts[i] },
]);
