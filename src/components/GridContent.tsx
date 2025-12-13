import { GridContainer } from '../../styles';
import { Thumbnail } from '.';

import { WorksData, WorksDataType } from '../types';

type Props = WorksDataType & {
  onThumbClick: (index: number) => void;
  includeItem?: (item: WorksData) => boolean;
  disableThumbClick?: boolean;
};

const GridContent = (props: Props) => {
  const { worksDataReversed, onThumbClick, includeItem, disableThumbClick } = props;
  const handleThumbClick: (index: number) => void = disableThumbClick ? (() => undefined) : onThumbClick;

  return (
    <GridContainer>
      <div className='grid'>
        {worksDataReversed.map((item, index) => {
          if (includeItem && !includeItem(item)) {
            return null;
          }

          return (
            <Thumbnail
              key={item.group}
              index={index}
              onThumbClick={handleThumbClick}
              {...item}
            />
          );
        })}
      </div>
    </GridContainer>
  );
};

export default GridContent;
