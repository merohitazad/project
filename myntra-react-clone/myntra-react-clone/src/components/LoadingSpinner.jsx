const LoadingSpinner = () => {
  return (
    <center className="spinner">
      <div className="spinner-border" style={{width:"4rem", height:"4rem", marginTop: "200px"}} role="status">
        <span className="visually-hidden"></span>
      </div>
    </center>
  );
};

export default LoadingSpinner;
