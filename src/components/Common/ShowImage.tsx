import { memo } from 'react';
import styled from 'styled-components';

import { IPFS_URL } from '@helpers/config';

const SImg = styled.div`
  img {
    width: 200px;
  }
`;

interface ShowImageProps {
  image: string | undefined;
  altText: string | undefined;
}

const ShowImage = ({ image, altText }: ShowImageProps) => {
  if (!image) {
    // TODO maybe add some default placeholder image
    return <>no image available</>;
  }

  return (
    <SImg>
      <img src={`${IPFS_URL}${image}`} alt={altText} />
    </SImg>
  );
};

export default memo(ShowImage);
