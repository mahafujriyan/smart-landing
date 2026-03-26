import { products } from "@/lib/products";

import HomeClient from "./sections/home-client";

export default function Page() {
  return <HomeClient products={products} />;
}
