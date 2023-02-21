import styled from "@emotion/styled";

const HeaderContainer = styled.header`
  padding: 20px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  @media screen and (max-width: 1200px) {
    padding: 20px;
    width: 100%;
  }
`;

export const HeaderTitle = styled.h3`
  font-family: "Pretendard";
  font-weight: 700;
  font-size: 24px;
`;

export const BackButton = styled.button`
  background-color: transparent;
  font-weight: 500;
  font-size: 1rem;
  padding: 4px 8px;
  border: none;
  cursor: pointer;
`;

export const HeaderButton = styled.button`
  cursor: pointer;
  border: none;
  font-weight: 700;
  @media screen and (min-width: 376px) {
    font-size: 1rem;
    padding: 8px;
    border-radius: 20px;
    color: #15b5bf;
    background-color: transparent;
    transition: background-color 0.2s ease-in;
    &:hover {
      background: rgba(101, 216, 223, 0.3);
    }
  }

  @media screen and (max-width: 375px) {
    color: white;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 30px 0;
    font-size: 20px;
    letter-spacing: 0.01em;
    background-color: #15b5bf;
    border-radius: 0%;
  }
`;

export const CustomHeader = ({ children }: any) => {
  return <HeaderContainer>{children}</HeaderContainer>;
};