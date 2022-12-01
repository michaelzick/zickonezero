import { GridContainer } from '../../styles';
import { Thumbnail } from '.';

import { WorksDataType } from '../types';

type Props = WorksDataType & {
  onThumbClick: Function;
};

const GridContent = (props: Props) => {
  const { worksDataReversed, onThumbClick } = props;

  return (
    <GridContainer>
      <div className='grid'>
        {worksDataReversed.map((item, index) => {
          const { group } = item;

          return (
            <Thumbnail
              key={group}
              index={index}
              onThumbClick={onThumbClick}
              {...item}
            />
          );
        })}
      </div>
    </GridContainer>
  );
};

export default GridContent;
