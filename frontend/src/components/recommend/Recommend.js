import React, { useEffect, useState } from 'react';
import Physical from '../images/PhysicalCheck.png';
import PhysicalHide from '../images/Physical60.png';
import Auditory from '../images/AuditoryCheck.png';
import AuditoryHide from '../images/Auditory60.png';
import Pregnant from '../images/PregnantCheck.png';
import PregnantHide from '../images/Pregnant60.png';
import Senior from '../images/SeniorCheck.png';
import SeniorHide from '../images/Senior60.png';
import Visual from '../images/VisualCheck.png';
import VisualHide from '../images/Visual60.png';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import RecommendCardList from './RecommendCardList.js';
import { useSelector } from 'react-redux';
import './Recommend.css';
import qs from 'qs';
import Button from '../common/Button';
import RecommendList from './RecommendList';
import RecommendDetail from './RecommendDetail';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import styled from 'styled-components';
import { Card } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

// You can also pass an optional settings object
// below listed default settings
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});

const AuthBarrierIconBlock = styled.div`
  img {
    margin: 1rem 0.5rem 0;
    cursor: pointer;
    width: 33;
  }
`;

const Recommend = () => {
  const myuser = useSelector((state) => state.user.userData);

  // ?????? ??????
  const [cityList, setCityList] = useState([]);
  const [townList, setTownList] = useState([]);
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [barrier, setBarrier] = useState([]);

  // ????????? ?????? ??????
  const [itemList, setItemList] = useState([]);
  const [searchLocationList, setSearchLocationList] = useState([]);
  const [searchFoodList, setSearchFoodList] = useState([]);
  const [searchHomeList, setSearchHomeList] = useState([]);
  const [searchCultureList, setSearchCultureList] = useState([]);
  const [searchPartyList, setSearchPartyList] = useState([]);
  const [noresult, setNoresult] = useState('');
  const [search, setSearch] = useState(false);
  const [findSearch, setFindSearch] = useState(false);
  const [number, setNumber] = useState(0);
  const [title, setTitle] = useState('');

  useEffect(() => {
    findMyLocation();
    setCityDropdown();
  }, [barrier]);

  // ??? ?????? ????????????
  const findMyLocation = () => {
    // Geolocation API??? ???????????? ??? ???????????? ??????
    if (navigator.geolocation) {
      //?????? ????????? ??????
      navigator.geolocation.getCurrentPosition(function (res) {
        axios({
          method: 'GET',
          url: '/recommend/myloc',
          params: {
            contentTypeId: 12,
            lat: res.coords.latitude, // ??????
            lng: res.coords.longitude, // ??????
            radius: 5000,
            userSeq: myuser.userSeq,
            page: 1,
            size: 20,
          },
        }).then(function (res) {
          if (res.data === '??????????????? ????????????.') {
            setItemList([]);
          } else {
            setItemList(res.data);
          }
        });
      });
    } else {
      alert('??? ????????????????????? Geolocation??? ???????????? ????????????.');
    }
  };

  // ?????? ?????? ????????????
  const setCityDropdown = () => {
    axios({
      method: 'GET',
      url: 'recommend/sido',
    }).then(function (res) {
      setCityList(res.data);
    });
  };

  const handleChangeCity = (event) => {
    if (town) {
      setTown('');
    }
    setCity(event.target.value);
    selectTown(event.target.value);
  };

  const selectTown = (sidoCode) => {
    axios({
      url: 'recommend/sigungu',
      method: 'GET',
      params: {
        sidoCode: sidoCode,
      },
    }).then(function (res) {
      setTownList(res.data);
    });
  };

  const handleChangeTown = (event) => {
    setTown(event.target.value);
  };

  // ??????
  const onClickSearch = () => {
    setItemList([]);
    setSearchLocationList([]);
    setSearchFoodList([]);
    setSearchHomeList([]);
    setSearchCultureList([]);
    setSearchPartyList([]);
    setSearch(true);
    const cityNum = Number(city);
    const townNum = Number(town);
    const impairmentNums = [0, 12, 39, 32, 14, 15];
    for (var i = 0; i < impairmentNums.length; i++)
      if (city && town && barrier) {
        let data = {
          sidoCode: cityNum,
          sigunguCode: townNum,
          userSeq: myuser.userSeq,
          contentTypeId: impairmentNums[i],
          impairments: barrier,
          page: 1,
          size: 5,
        };
        axios({
          method: 'GET',
          url: '/recommend/search',
          params: data,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        }).then((res) => {
          if (res.config.params.contentTypeId === 0) {
            if (res.data.length > 0) {
              setItemList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 12) {
            if (res.data.length > 0) {
              setSearchLocationList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 39) {
            if (res.data.length > 0) {
              setSearchFoodList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 32) {
            if (res.data.length > 0) {
              setSearchHomeList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 14) {
            if (res.data.length > 0) {
              setSearchCultureList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 15) {
            if (res.data.length > 0) {
              setSearchPartyList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          }
          setFindSearch(false);
        });
      } else if (barrier) {
        let data = {
          userSeq: myuser.userSeq,
          contentTypeId: impairmentNums[i],
          impairments: barrier,
          page: 1,
          size: 5,
        };
        axios({
          method: 'GET',
          url: '/recommend/search',
          params: data,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        }).then((res) => {
          if (res.config.params.contentTypeId == 0) {
            if (res.data.length > 0) {
              setItemList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 12) {
            if (res.data.length > 0) {
              setSearchLocationList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 39) {
            if (res.data.length > 0) {
              setSearchFoodList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 32) {
            if (res.data.length > 0) {
              setSearchHomeList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 14) {
            if (res.data.length > 0) {
              setSearchCultureList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 15) {
            if (res.data.length > 0) {
              setSearchPartyList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          }
          setFindSearch(false);
        });
      } else if (city && town) {
        let data = {
          sidoCode: cityNum,
          sigunguCode: townNum,
          userSeq: myuser.userSeq,
          contentTypeId: impairmentNums[i],
          page: 1,
          size: 5,
        };
        axios({
          method: 'GET',
          url: '/recommend/search',
          params: data,
        }).then((res) => {
          if (res.config.params.contentTypeId === 0) {
            if (res.data.length > 0) {
              setItemList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 12) {
            if (res.data.length > 0) {
              setSearchLocationList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 39) {
            if (res.data.length > 0) {
              setSearchFoodList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 32) {
            if (res.data.length > 0) {
              setSearchHomeList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 14) {
            if (res.data.length > 0) {
              setSearchCultureList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          } else if (res.config.params.contentTypeId === 15) {
            if (res.data.length > 0) {
              setSearchPartyList(res.data);
            } else {
              setNoresult('?????? ????????? ???????????? ????');
            }
          }
          setFindSearch(false);
        });
      } else if (city) {
        alert('????????? ????????? ???????????????.');
      } else if (city && barrier) {
        alert('????????? ????????? ???????????????.');
      }
  };

  const onClickTotal = () => {
    setFindSearch(false);
    setNumber(0);
  };

  const onClickLocation = () => {
    setTitle('??????');
    setFindSearch(true);
    setNumber(12);
  };

  const onClickFood = () => {
    setFindSearch(true);
    setNumber(39);
    setTitle('?????????');
  };

  const onClickHome = () => {
    setFindSearch(true);
    setNumber(32);
    setTitle('????????????');
  };

  const onClickParty = () => {
    setFindSearch(true);
    setNumber(15);
    setTitle('??????');
  };

  const onClickCulture = () => {
    setFindSearch(true);
    setNumber(14);
    setTitle('??????');
  };

  const changeFindSearch = () => {
    setFindSearch(true);
    setNumber(15);
    setTitle('??????');
  };

  const onClickReset = () => {
    setBarrierIcon({
      ...barrierIcon,
      physicalFlag: false,
      visibilityFlag: false,
      deafFlag: false,
      infantFlag: false,
      seniorFlag: false,
    });
    setCity('');
    setTown('');
    setBarrier([]);
  };

  const [barrierIcon, setBarrierIcon] = useState({
    physicalFlag: false,
    visibilityFlag: false,
    deafFlag: false,
    infantFlag: false,
    seniorFlag: false,
  });
  const { physicalFlag, visibilityFlag, deafFlag, infantFlag, seniorFlag } =
    barrierIcon;

  return (
    <div data-aos="fade-up">
      <div class="selete-box">
        <Card sx={{ width: 550 }}>
          <h2 class="recommend-title-first">????????? ????????????</h2>

          <AuthBarrierIconBlock>
            <img
              class="barrier-icon"
              id="physical"
              onClick={() => {
                if (barrier.includes('physical')) {
                  barrier.splice('physical');
                  setBarrierIcon({ ...barrierIcon, physicalFlag: false });
                } else {
                  barrier.push('physical');
                  setBarrierIcon({ ...barrierIcon, physicalFlag: true });
                }
              }}
              src={physicalFlag ? Physical : PhysicalHide}
            ></img>
            <img
              class="barrier-icon"
              id="visibility"
              onClick={() => {
                if (barrier.includes('visibility')) {
                  barrier.splice('visibility');
                  setBarrierIcon({ ...barrierIcon, visibilityFlag: false });
                } else {
                  barrier.push('visibility');
                  setBarrierIcon({ ...barrierIcon, visibilityFlag: true });
                }
              }}
              src={visibilityFlag ? Visual : VisualHide}
            ></img>
            <img
              class="barrier-icon"
              id="deaf"
              onClick={() => {
                if (barrier.includes('deaf')) {
                  barrier.splice('deaf');
                  setBarrierIcon({ ...barrierIcon, deafFlag: false });
                } else {
                  barrier.push('deaf');
                  setBarrierIcon({ ...barrierIcon, deafFlag: true });
                }
              }}
              src={deafFlag ? Auditory : AuditoryHide}
            ></img>
            <img
              class="barrier-icon"
              id="infant"
              onClick={() => {
                if (barrier.includes('infant')) {
                  barrier.splice('infant');
                  setBarrierIcon({ ...barrierIcon, infantFlag: false });
                } else {
                  barrier.push('infant');
                  setBarrierIcon({ ...barrierIcon, infantFlag: true });
                }
              }}
              src={infantFlag ? Pregnant : PregnantHide}
            ></img>
            <img
              class="barrier-icon"
              id="senior"
              onClick={() => {
                if (barrier.includes('senior')) {
                  barrier.splice('senior');
                  setBarrierIcon({ ...barrierIcon, seniorFlag: false });
                } else {
                  barrier.push('senior');
                  setBarrierIcon({ ...barrierIcon, seniorFlag: true });
                }
              }}
              src={seniorFlag ? Senior : SeniorHide}
            ></img>
          </AuthBarrierIconBlock>
          <h2 class="recommend-title">????????? ????????????</h2>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="find-city">?????? ??????</InputLabel>
            <Select
              labelId="find-city"
              id="find-city"
              value={city}
              onChange={handleChangeCity}
              label="??????"
            >
              {cityList.map((city) => (
                <MenuItem name={city.name} value={city.code} key={city.code}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="find-town">????????? ??????</InputLabel>
            <Select
              labelId="find-town"
              id="find-town"
              value={town}
              onChange={handleChangeTown}
              label="??????"
            >
              {townList.map((town) => (
                <MenuItem value={town.code} key={town.rnum}>
                  {town.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div class="button-list">
            <Button variant="contained" id="search" onClick={onClickSearch}>
              ??????
            </Button>
            <Button variant="contained" id="reset" onClick={onClickReset}>
              ?????????
            </Button>
          </div>
        </Card>
      </div>
      <div>
        {search === false ? (
          <div>
            <div>
              <h2 class="my-loc">??? ?????? ????????? ?????????</h2>
              <span class="find-myloc" onClick={findMyLocation}>
                <MyLocationIcon fontSize="small"></MyLocationIcon>??? ??????
                ????????????
              </span>
            </div>
            {itemList.length > 0 ? (
              <div>
                <RecommendCardList itemList={itemList}></RecommendCardList>
              </div>
            ) : (
              <div>{noresult}</div>
            )}
          </div>
        ) : findSearch === false ? (
          <div>
            <div>
              <table class="table-row">
                <th class="table-col" onClick={onClickTotal}>
                  ??????
                </th>
                <th class="table-col" onClick={onClickLocation}>
                  ??????
                </th>
                <th class="table-col" onClick={onClickFood}>
                  ?????????
                </th>
                <th class="table-col" onClick={onClickHome}>
                  ????????????
                </th>
                <th class="table-col" onClick={onClickCulture}>
                  ??????
                </th>
                <th class="table-col" onClick={onClickParty}>
                  ??????
                </th>
              </table>
            </div>
            <RecommendList
              class="card-list"
              changeFindSearch={changeFindSearch}
              setNumber={setNumber}
              setTitle={setTitle}
              searchLocationList={searchLocationList}
              noresult={noresult}
              searchFoodList={searchFoodList}
              searchHomeList={searchHomeList}
              searchCultureList={searchCultureList}
              searchPartyList={searchPartyList}
            ></RecommendList>
          </div>
        ) : (
          <div>
            <table class="table-row">
              <th class="table-col" onClick={onClickTotal}>
                ??????
              </th>
              <th class="table-col" onClick={onClickLocation}>
                ??????
              </th>
              <th class="table-col" onClick={onClickFood}>
                ?????????
              </th>
              <th class="table-col" onClick={onClickHome}>
                ????????????
              </th>
              <th class="table-col" onClick={onClickCulture}>
                ??????
              </th>
              <th class="table-col" onClick={onClickParty}>
                ??????
              </th>
            </table>
            <h2 class="title">{title}</h2>
            <RecommendDetail
              noresult={noresult}
              number={number}
              city={city}
              town={town}
              barrier={barrier}
            ></RecommendDetail>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;
