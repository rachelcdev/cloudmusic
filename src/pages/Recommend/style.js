import styled from "styled-components";
import style from "../../styles/global-style";
export const Content = styled.div`
  position: fixed;
  top: 90px;
  bottom: ${(props) => (props.play > 0 ? "60px" : 0)};
  width: 100%;
`;
