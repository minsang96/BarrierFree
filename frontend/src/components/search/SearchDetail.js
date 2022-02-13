import React, { useEffect, useState } from 'react';
import axios from '../../../node_modules/axios/index';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SearchCardList from './SearchCardList.js';
import { useNavigate } from '../../../node_modules/react-router/index.js';
import { Container } from '@material-ui/core';

const SearchDetail = ( {number, searchItem, noresult } ) => {
  const [searchList, setSearchList] = useState([]);
  const myuser = useSelector((state) => state.user.userData);
  const location = useLocation();
  // console.log(location);
  // const number = location.state.number;
  // const searchItem = location.state.searchItem;
  const navigate = useNavigate();

  const getSearchDetail = () => {
    axios({
      methods: 'GET',
      url: '/search/tour',
      params: {
        contentTypeId: number,
        keyword: searchItem,
        page: 0,
        size: 12,
        userSeq: myuser.userSeq,
      },
    }).then((res) => {
      console.log(res);
      setSearchList(res.data);
    });
  };

  useEffect(() => {
    getSearchDetail();
  }, [number]);

  // const onClickToSearch = () => {
  //   navigate('/search');
  // };

  return (
    <Container maxWidth="md">
    <div>
      {searchList.length > 0? 
      <SearchCardList itemList={searchList}></SearchCardList>:
      <div>
      <p>{noresult}</p>
    </div>
      }
    </div>
    </Container>
  );
};

export default SearchDetail;
