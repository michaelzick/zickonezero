import { Nav } from '../../styles';

import { Title, SubTitle } from '../../styles';
import { LinkBoxContent } from '.';

const NavContent = () => (
  <Nav>
    <div className='titles'>
      <Title>
        ZICKONEZERO Engineering
      </Title>
      <SubTitle>
        React Development & Cybersecurity
      </SubTitle>
    </div>

    <LinkBoxContent />
  </Nav>
);

export default NavContent;
