import React, { useState, useEffect, useRef, memo } from "react";
import Scroll from "./Scroll";
import PropType from "prop-types";
import style from "../styles/global-style";
import styled from "styled-components";

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style["font-size-m"]};
    vertical-align: middle;
  }
`;
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`;
function HorizonItem(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;
  const category = useRef(null);
  useEffect(() => {
    let categoryDOM = category.current;
    let tagElems = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth;
    });
    categoryDOM.style.width = `${totalWidth}px`;
  }, []);
  return (
    <Scroll direction="horizontal">
      <div ref={category}>
        <List>
          <span>{title}</span>
          {list.map((item) => {
            return (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ? "selected" : ""}`}
                onClick={() => handleClick(item.key)}
              >
                {item.name}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Scroll>
  );
}

HorizonItem.defaultProps = {
  list: [],
  oldVal: "",
  title: "",
  handleClick: null,
};

HorizonItem.propType = {
  list: PropType.array,
  oldVal: PropType.string,
  title: PropType.string,
  handleClick: PropType.func,
};
export default memo(HorizonItem);
