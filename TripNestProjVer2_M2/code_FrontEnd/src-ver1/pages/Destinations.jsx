import { useState } from "react";
import DestinationCard from "../components/DestinationCard";

const destinations = [
  { name: "Goa", country: "India", emoji: "🇮🇳", description: "Beaches, sunsets and unforgettable coastal experiences." },
  { name: "Paris", country: "France", emoji: "🇫🇷", description: "Art, architecture, cafés and the timeless city of lights." },
  { name: "Tokyo", country: "Japan", emoji: "🇯🇵", description: "A vibrant mix of tradition, technology and culture." },
  { name: "Rome", country: "Italy", emoji: "🇮🇹", description: "Ancient history, iconic landmarks and incredible food." },
  { name: "Bali", country: "Indonesia", emoji: "🇮🇩", description: "Tropical landscapes, temples, beaches and calm escapes." },
  { name: "Dubai", country: "UAE", emoji: "🇦🇪", description: "Modern architecture, luxury experiences and desert adventures." }
];

function Destinations() {
  const [search, setSearch] = useState("");
  const filtered = destinations.filter((d) =>
    `${d.name} ${d.country}`.toLowerCase().includes(search.toLowerCase())
  );

  function handleExplore(name) {
    alert(`Exploring trips and itineraries for ${name}!`);
  }

  return (
    <div className="content-page">
      <section className="page-heading">
        <span className="eyebrow">DISCOVER YOUR NEXT ESCAPE</span>
        <h1>Explore destinations</h1>
        <p>Find inspiration for your next unforgettable journey.</p>
      </section>

      <div className="search-bar">
        <span>⌕</span>
        <input
          aria-label="Search destinations"
          placeholder="Search destinations or countries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="destination-grid">
        {filtered.map((destination) => (
          <DestinationCard
            key={destination.name}
            destination={destination}
            onExplore={handleExplore}
          />
        ))}
      </div>
    </div>
  );
}

export default Destinations;
