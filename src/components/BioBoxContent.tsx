import Image from 'next/image';

import { BioBox } from '../../styles';

const BioBoxContent = () => (
  <BioBox id='about'>
    <div className='biobox-inner'>
      <div className='text-wrapper'>
        <h2>Hi, I{"'"}m Michael.</h2>
        <br />
        I{"'"}m a frontend engineer, coach, and cybersecurity enthusiast based in Los Angeles, CA. Most mornings you can find me at the beach or at the gym earlier than most people you know.
        <br /><br />
        I have the CompTIA Security+ certification and over 15 years in IT. Additionally, I{"'"}ve led groups and individuals to personal and career success through coaching.
        <br /><br />
        You can see some samples of the projects I{"'"}ve built in the gallery above, code samples at <a href='https://github.com/michaelzick' target='_blank' rel='noreferrer'>GitHub</a>, and a full qualification on <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noreferrer'>LinkedIn</a>.
      </div>
      <div className='headshot'>
        <Image src='/img/headshot.jpeg' alt='headshot' width='350' height='392'
          placeholder='blur' blurDataURL='/img/headshot.jpeg' />
      </div>
    </div>
  </BioBox>
);

export default BioBoxContent;
