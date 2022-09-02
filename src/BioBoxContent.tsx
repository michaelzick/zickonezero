import { BioBox } from '../styles';
import Image from 'next/image';

const BioBoxContent = () => (
  <BioBox id='about'>
    <div className='biobox-inner'>
      <div className='text-wrapper'>
        <h2>Hi, I{"'"}m Michael.</h2>
        <br />
        I{"'"}m a frontend engineer, coach, and cybersecurity enthusiast based in Los Angeles, CA. Most mornings you can find me at the beach or the gym earlier than probably anyone you know.
        <br /><br />
        You can see some samples of the projects I{"'"}ve build in the gallery above, code samples at <a href='https://github.com/michaelzick' target='_blank' rel='noreferrer'>GitHub</a>, and a full qualification on <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noreferrer'>LinkedIn</a>.
      </div>
      <Image width={300} height={336} layout='fixed' className='headshot' src='/img/headshot.jpeg' alt='headshot' />
    </div>
  </BioBox>
);

export default BioBoxContent;
