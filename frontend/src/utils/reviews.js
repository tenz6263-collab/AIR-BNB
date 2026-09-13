/** Keywords used to match topic chips against review text. */
export const TOPIC_KEYWORDS = {
  Comfort: ['comfort', 'cozy', 'relax'],
  Accuracy: ['as described', 'as shown', 'exactly', 'accurate'],
  'Hot tub': ['jacuzzi', 'hot tub'],
  Condition: ['maintained', 'condition', 'well-kept', 'pristine'],
  Hospitality: ['host', 'helpful', 'responsive', 'team', 'nitish'],
  Cleanliness: ['clean', 'spotless'],
  Amenities: ['equipped', 'amenit', 'wifi', 'tv'],
  Decor: ['decor', 'interior', 'stylish'],
  'Indoor spaces': ['space', 'room', 'apartment', 'home'],
  Location: ['location', 'goa', 'candolim', 'beach'],
};

export function reviewsForTopic(reviews, topic) {
  if (!topic) return reviews;
  const words = TOPIC_KEYWORDS[topic] || [topic.toLowerCase()];
  return reviews.filter((r) => words.some((w) => r.text.toLowerCase().includes(w)));
}
