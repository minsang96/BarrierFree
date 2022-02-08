import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import RecommendBarrierIcon from './RecommendBarrierIcon';
import axios from 'axios';
import Review from '../review/Review';
import { Link, useNavigate } from 'react-router-dom';

const RecommendCard = ({ item }) => {
  const navigate = useNavigate();

  const { addr1, contentid, firstimage, scrap_yn, title } = item;
  const infomationCard = item.contentid;
  // const barriers = item.impairment;
  // const contentid  = item.contentid;
  // const state = { 'detailnum': reviewCard}
  const onClickCard = () => {
    // console.log(e)
    axios({
      method: 'GET',
      url: 'recommend/detail',
      params: { contentid: contentid },
    }).then(function (res) {
      navigate(`/recommend/detail/${contentid}`);
    });

    // document.location.href = '/detail/'+ reviewCard
  };

  return (
    <div>
      {/* <Link to={{ pathname: '/post/detail/:reviewCard', state: { detailnum : reviewCard}}}> */}
      <Card
        onClick={onClickCard}
        infomationCard={infomationCard}
        sx={{ maxWidth: 250 }}
      >
        {/* <Card onClick={onClickCard} pageNum={reviewCard} sx={{ maxWidth: 250 }}> */}
        <CardMedia
          component="img"
          height="300"
          image={firstimage}
          alt="Dog Picture"
        />

        <CardContent align="left">
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {title}
          {/* <RecommendBarrierIcon barriers={barriers}></RecommendBarrierIcon> */}
        </CardContent>
      </Card>
      {/* </Link> */}
    </div>
  );
};
export default RecommendCard;
