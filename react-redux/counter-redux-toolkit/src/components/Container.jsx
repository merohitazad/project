const Container = ({children}) => {
  return (
    <div className="card" style={{width: "50%", margin: "100px 25%", padding: "50px"}}>
      {children}
    </div>
  );
};

export default Container;
