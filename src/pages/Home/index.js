import React from "react";
import { renderRoutes } from "react-router-config";
import { NavLink } from "react-router-dom";
import { Top, Tab, TabItem } from "./style";
import Player from "../Player/index";
function Home(props) {
  const { route } = props;

  return (
    <div>
      <Top>
        <span className="iconfont menu selected">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span
          className="iconfont search selected"
          onClick={() => props.history.push("/search")}
        >
          &#xe62b;
        </span>
      </Top>
      <Tab>
        <NavLink to="/recommend" activeClassName="selected">
          <TabItem>
            <span> Recommend </span>
          </TabItem>
        </NavLink>
        <NavLink to="/singers" activeClassName="selected">
          <TabItem>
            <span> Singers </span>
          </TabItem>
        </NavLink>
        <NavLink to="/rank" activeClassName="selected">
          <TabItem>
            <span> Rank </span>
          </TabItem>
        </NavLink>
      </Tab>
      {renderRoutes(route.routes)}
      <Player></Player>
    </div>
  );
}
export default React.memo(Home);
