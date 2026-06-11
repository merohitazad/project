import { useSelector } from "react-redux";
import HomeItem from "../components/HomeItem";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const items = useSelector((store) => store.items);
  const fetchStatus = useSelector((store) => store.fetchStatus);
  
  return (
    <main>
      <div className="items-container">
        {fetchStatus.fetchDone ? items.map((item) => (
          <HomeItem key={item.id} item={item} />
        )) : <LoadingSpinner />}
      </div>
    </main>
  );
};

export default Home;
