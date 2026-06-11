import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemsActions } from "../store/itemsSlice";
import { fetchStatusActions } from "../store/fetchStatusSlice";
import { bagActions } from "../store/bagSlice";
import { getItemsFromServer } from "../services/itemService";
import { fetchBagItemsFromServer } from "../services/bagService"; 

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const itemsController = new AbortController();
    const bagController = new AbortController();

    dispatch(fetchStatusActions.markFetchingStarted());

    const fetchCatalog = async () => {
      try {
        const items = await getItemsFromServer(itemsController.signal);
        dispatch(itemsActions.addInitialItems(items));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("❌ CRITICAL ERROR IN FETCH CATALOG:", err);
        }
        throw err; 
      }
    };
    
    const fetchBag = async () => {
      try {
        const bagItemsId = await fetchBagItemsFromServer(bagController.signal);
        dispatch(bagActions.initialBagItems(bagItemsId));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("❌ CRITICAL ERROR IN FETCH BAG:", err);
        }
        throw err;
      }
    };

    Promise.allSettled([fetchCatalog(), fetchBag()])
      .then((results) => {
        console.log("Promises settled results:", results);
      })
      .catch((err) => {
        console.error("Something went wrong with allSettled itself:", err);
      })
      .finally(() => {
        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
      });

    return () => {
      itemsController.abort();
      bagController.abort();
    };
  }, [dispatch]); 

  return <></>;
};

export default FetchItems;