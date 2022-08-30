import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: white;
`;

export const Title = styled.h1`
  color: #4e4e57;
  font-size: 6rem;
  margin: 0;
`;

export const SubTitle = styled.h2`
  color: #4e4e57;
  margin: 0 0 3rem 0;
  line-height: 1.15;
  font-size: 3rem;
  ${(props) => props.italic && 'font-style: italic;'}
`;
