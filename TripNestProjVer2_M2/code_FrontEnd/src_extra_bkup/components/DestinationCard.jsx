function DestinationCard({ destination, onExplore }) {
  return (
    <div>
      <h2>
        {destination.emoji} {destination.name}
      </h2>
      <p>{destination.country}</p>
      <p>{destination.description}</p>
      <button onClick={() => onExplore(destination.name)}>
        Explore
      </button>
    </div>
  );
}

export default DestinationCard;