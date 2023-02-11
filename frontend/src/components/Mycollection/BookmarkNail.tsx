import "./MyCollection.css";
import useGet from "../../hooks/useGet";
import { api_origin } from "../../api";
import { IonGrid, IonRow } from "@ionic/react";
import { useState } from "react";
import ProductList from "../Product/ProductList";
import { useUserID } from "../../redux/selector";
import ProductDetail from "../Product/ProductDetail";

// type GetBookmarkNailPayload = {
//   error?: string;
//   nails?: {
//     id?: number;
//     images?: string;
//   }[];
// };
type ProductDetailProps = {
  id: number;
  intro: string;
  shop_id: number;
  images: string;
  like_qty: string;
};

function BookmarkNail() {
  const userID = useUserID();

  const [productDetail, setProductDetail] = useState<ProductDetailProps>();
  const [productModal, setProductModal] = useState<boolean>(false);

  function productOpenModal(product: ProductDetailProps) {
    setProductDetail(product);
    setProductModal(true);
  }
  // const nails = useGet<GetBookmarkNailPayload>({
  //   name: "getMyBookMarkNail",
  //   pathname: "/bookmarkNail",
  //   defaultValue: {},
  // });

  return (
    <>
      <ProductList productOpenModal={productOpenModal} collecter_id={userID} />
      <ProductDetail
        productModal={productModal}
        setProductModal={setProductModal}
        productDetail={productDetail}
      />
    </>
  );
}

export default BookmarkNail;
