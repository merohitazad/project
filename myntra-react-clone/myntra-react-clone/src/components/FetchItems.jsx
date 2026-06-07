import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemsActions } from "../store/itemsSlice";
import { fetchStatusActions } from "../store/fetchStatusSlice";
import { bagActions } from "../store/bagSlice";
import { getItemsFromServer } from "../services/itemService";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const itemsController = new AbortController();
    const bagController = new AbortController();

    dispatch(fetchStatusActions.markFetchingStarted());

    // fetch("http://localhost:8080/items", { signal })
    const fetchCatalogItems = (async () => {
      const items = await getItemsFromServer(itemsController.signal);
      // console.log("Fetched items from server:", items);
      dispatch(itemsActions.addInitialItems(items));
    })().catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch items:", err);
      }
    });

    const fetchBagItems = (async () => {
      const response = await fetch(
        "https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/bagItems",
        { signal: bagController.signal }
      );
      const { bagItemsId } = await response.json();
      dispatch(bagActions.initialBagItems(bagItemsId));
    })().catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch bag items:", err);
      }
    });

    Promise.allSettled([fetchCatalogItems, fetchBagItems]).then(() => {
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