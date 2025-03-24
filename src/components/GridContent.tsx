import { GridContainer } from '../../styles';
import { Thumbnail } from '.';

import { WorksDataType } from '../types';

type Props = WorksDataType & {
  onThumbClick: Function;
  isManagedWork?: boolean;
};

const GridContent = (props: Props) => {
  const { worksDataReversed, onThumbClick, isManagedWork } = props;
  const WorkItem = isManagedWork ? (
    <GridContainer>
      <div className='grid'>
        {worksDataReversed.map((item, index) => {
          const { group } = item;

          if (index === 0) {
            return (
              <Thumbnail
                key={group}
                index={index}
                returnVoid
                onThumbClick={() => onThumbClick(null, true)}
                {...item}
              />
            );
          }
        })}
      </div>
    </GridContainer>
  ) : (
    <GridContainer>
      <div className='grid'>
        {worksDataReversed.map((item, index) => {
          const { group } = item;

          if (index > 0) {
            return (
              <Thumbnail
                key={group}
                index={index}
                onThumbClick={onThumbClick}
                {...item}
              />
            );
          }
        })}
      </div>
    </GridContainer>
  );

  return WorkItem;
};

export default GridContent;
