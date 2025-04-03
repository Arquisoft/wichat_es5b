const ProgressBar = ({ timeLeft }) => {
  return (
    <div className="bg-orange rounded-lg overflow-hidden px-2 mx-4">
      <progress
        className="progress-bar"
        value={timeLeft}
        max={60}
        width="100%"
      />
    </div>
  );
};

export default ProgressBar;
