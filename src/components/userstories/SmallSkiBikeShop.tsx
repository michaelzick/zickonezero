import { type ReactNode } from 'react';
import {
  BioBox,
  DemoStokeTitle,
  DemoStokeTwoColumnLayout,
  DemoStokeTwoColumnRow,
  DemoStokeTwoColumnHeader,
  DemoStokeTwoColumnCopy,
  WhiteTransitionAnchor,
  DemoStokeBorderBox,
  DemoStokeTwoUp,
} from '../../../styles';

type StoryProps = {
  wrapWithBioBox?: boolean;
};

const SmallSkiBikeShop = ({ wrapWithBioBox = true }: StoryProps) => {
  const DSLink = <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>DemoStoke</WhiteTransitionAnchor>;

  const renderTable = (items: { title: string; description: ReactNode; }[]) => (
    <DemoStokeTwoColumnLayout>
      {items.map(({ title, description }) => (
        <DemoStokeTwoColumnRow key={title}>
          <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
          <DemoStokeTwoColumnCopy>{description}</DemoStokeTwoColumnCopy>
        </DemoStokeTwoColumnRow>
      ))}
    </DemoStokeTwoColumnLayout>
  );

  const painPoints = [
    {
      title: 'Clunky demo process',
      description: 'Jason still used paper forms and waivers; digital systems felt too expensive or confusing to adopt.'
    },
    {
      title: 'Premium demos hidden',
      description: 'High-end demo gear was labeled “Premium Rentals,” with no easy way to know the actual brand or model.'
    },
    {
      title: 'In-store knowledge bottleneck',
      description: 'The gear you received depended on the associate; the website lacked real-time gear visibility.'
    },
    {
      title: 'One-off demo days',
      description: 'Large demo events ran once or twice a year, resource-heavy and missing most of the season’s traffic.'
    },
    {
      title: 'No real-time inventory online',
      description: 'Lightspeed POS managed gear, but nothing synced to the site to show what was available to try or rent.'
    }
  ];

  const howHelps = [
    {
      title: 'Paperless demos with visibility',
      description: (
        <>
          {DSLink} connected to Lightspeed to pull real-time listings by brand, model, size, and condition; waivers, dates, and reservations went digital.
        </>
      )
    },
    {
      title: 'Premium gear discoverable',
      description: 'Instead of “Premium Rental,” the exact models were shown, selling the value of trying before buying high-end gear.'
    },
    {
      title: 'Improves trust and decisions',
      description: 'Demo gear carried reviews, usage history, and verified ratings so customers could compare and reserve confidently.'
    },
    {
      title: 'Always-on demo days',
      description: 'Riders could test gear whenever available, turning the mountain into a rolling demo hub without more staff.'
    },
    {
      title: 'Light integration',
      description: `${DSLink} became the discovery portal, syncing with Lightspeed and handling the UX lift without overhauling the site.`
    }
  ];

  const whyHelps = [
    {
      title: 'Streamlined workflow',
      description: 'Staff spent less time on paper forms and more time guiding customers.'
    },
    {
      title: 'Converts demo into retail',
      description: 'Try-before-buy increased confidence and drove more sales with less friction.'
    },
    {
      title: 'Smart inventory utilization',
      description: 'Idle gear could earn money or help convert new buyers.'
    },
    {
      title: 'Expands market reach',
      description: `${DSLink} discovery tools brought in vacationers and new locals—not just Google Maps foot traffic.`
    }
  ];

  const content = (
    <div>
      <section id='story-small-ski-shop' className='story-section'>
        <DemoStokeTitle>The Small Ski &amp; Bike Shop</DemoStokeTitle>

        <DemoStokeBorderBox>
          <DemoStokeTwoUp>
            <section className='story-section'>
              <h3>Abstract</h3>
              <p>
                For Jason, the owner of <strong>Town &amp; Country Outfitters</strong>, a high-end ski and bike shop in a mountain town, {DSLink} offered a way to modernize without losing what made his shop personal and trusted. DemoStoke solved his toughest problems around demo logistics, digital visibility, and customer trust.
              </p>
            </section>
            <section className='story-section'>
              <h3>Use Case Scenario</h3>
              <p>
                A local rider wanted to try a Never Summer snowboard before buying. He visited Town &amp; Country’s {DSLink} page, saw that a 158cm Proto Synthesis was available for demo, and booked it for the weekend.
                <br /><br />
                He picked it up Saturday morning after signing the waiver digitally. He rode it at Mountain View, loved it, and left a 5-star review.
                <br /><br />
                That night, he placed an order for a brand new one—picked up the next week. Jason never had to explain sizing or features—the app did that work.
              </p>
            </section>
          </DemoStokeTwoUp>
        </DemoStokeBorderBox>
      </section>

      <section className='story-section'>
        <h3>Current Pain Points</h3>
        {renderTable(painPoints)}
      </section>

      <section className='story-section'>
        <h3>How DemoStoke Helps</h3>
        {renderTable(howHelps)}
      </section>

      <section className='story-section'>
        <h3>Why This Helps Jason Scale</h3>
        {renderTable(whyHelps)}
      </section>
    </div>
  );

  if (!wrapWithBioBox) {
    return content;
  }

  return (
    <BioBox direction='right' noBottomPadding someTopPadding>
      <div className='biobox-inner demostoke-inner'>
        {content}
      </div>
    </BioBox>
  );
};

export default SmallSkiBikeShop;
