const ProgressBar = ({ timeLeft, maxTime }) => {
  return (
    <div className="bg-orange rounded-lg overflow-hidden px-2 mx-4">
      <progress
        className="progress-bar"
        value={timeLeft}
        max={maxTime}
        width="100%"
      />
    </div>
  );
};

export default ProgressBar;
