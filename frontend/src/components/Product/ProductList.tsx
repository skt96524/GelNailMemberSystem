import {
  IonCard,
  IonCol,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
} from "@ionic/react";
import { useState } from "react";
import useGet from "../../hooks/useGet";
import { IonInfiniteScrollCustomEvent } from "@ionic/core";
import "../ArticleList.css";
import { api_origin } from "../../api";

type ProductDetail = {
  id: number;
  intro: string;
  shop_id: number;
  images: string;
  like_qty: string;
};

type productListPayload = {
  error?: string;
  products?: ProductDetail[];
};

function ProductList(props: {
  searchText?: string;
  type?: string;
  productOpenModal: (product: ProductDetail) => void;
  shop_id?: number;
  collecter_id?: number;
}) {
  const [hasLoadMore, setHasLoadMore] = useState(false);

  let query = {};
  if (props.collecter_id) {
    query = { ...query, collecter_id: props.collecter_id };
  }
  if (props.searchText) {
    query = { ...query, searchText: props.searchText };
  }
  if (props.shop_id) {
    query = { ...query, shop_id: props.shop_id };
  }

  if (props.type) {
    query = { ...query, productType: props.type };
  }
  const productList = useGet<productListPayload>({
    name: "products",
    pathname: "/productsList",
    query: query,
    defaultValue: {},
    shouldAutoReload: (json) => {
      return !hasLoadMore;
    },
  });

  async function loadMore(ev: IonInfiniteScrollCustomEvent<void>) {
    const offset = productList.state.payload.products?.length || 0;

    let json = await productList.loadMore(offset);
    if (json.error) {
    }
    if (json.products) {
      productList.setState((state) => ({
        ...state,
        payload: {
          products: [...(state.payload.products || []), ...json.products],
        },
      }));
      setHasLoadMore(true);
    }
    ev.target.complete();
  }

  return (
    <>
      {productList.render((json) => (
        <>
          <IonGrid>
            <IonRow>
              {json.products?.map((product) => (
                <>
                  <IonCol size="6" key={product.id}>
                    <IonCard
                      className="no-margin"
                      onClick={() => {
                        props.productOpenModal(product);
                      }}
                    >
                      <img
                        src={`${api_origin}/uploads/${product.images}`}
                      ></img>
                    </IonCard>
                  </IonCol>
                </>
              ))}
              <IonInfiniteScroll onIonInfinite={loadMore}>
                <IonInfiniteScrollContent></IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </IonRow>
          </IonGrid>
        </>
      ))}
    </>
  );
}

export default ProductList;
