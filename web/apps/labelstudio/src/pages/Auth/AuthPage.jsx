import {Block, Elem} from "../../utils/bem";
import {Oneof} from "../../components/Oneof/Oneof";
import {Spinner} from "../../components";
import React, {useEffect, useState} from "react";
import {useAbortController} from "../../hooks/useAbortController";
import {useAPI} from "../../providers/ApiProvider";
import "./AuthPage.scss";

export const AuthPage = () => {
  const api = useAPI();
  const abortController = useAbortController();
  const [groupList, setGroupList] = useState([])
  const [networkState, setNetworkState] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(30);
  const [total, setTotal] = useState(0);

  const fetchGroups = async (page = currentPage, pageSize = currentPageSize) => {
    setNetworkState("loading");
    abortController.renew(); // Cancel any in flight requests

    const data = await api.callApi("me")
    console.log(data)
  }

  useEffect(() => {
    fetchGroups()
  }, []);

  return (
    <Block name="auth-page">
      <Oneof value={networkState}>
        <Elem name="loading" case="loading">
          <Spinner size={64} />
        </Elem>

        <Elem name="content" case="loaded">

        </Elem>
      </Oneof>
    </Block>
  )
}

AuthPage.title = "权限管理"
AuthPage.path = "/auth"
AuthPage.exact = true
