const ProgressBar = ({ timeLeft}) => {

  return (
    <div className="bg-orange rounded-lg overflow-hidden px-2 mx-4">
      <div
        className={`h-full transition-all duration-1000 ease-linear bg-blue-500`}
        style={{ width: "100%" }}>
        <progress
          value={timeLeft}
          max={60}
          className= "bg-blue-500"
          width = "100%"
        />
      </div>
    </div>
  );
};


export default ProgressBar;
