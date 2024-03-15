import requests from "@/utils/requests";
import { useEffect, useState } from "react";

interface propsType {
  url: string;
}

export default function useGetData(props: propsType) {
  const [data, setData] = useState({});

  useEffect(() => {
    requests.get(props.url, {});
  }, [props.url]);

  return {
    data: data,
  };
}
