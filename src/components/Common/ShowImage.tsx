import { memo } from 'react';
import { Card } from 'react-bootstrap';
import { styled } from 'styled-components';

import { IPFS_GATEWAY } from '@helpers/config.ts';

const SImg = styled.div`
  img {
    max-width: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

interface ShowImageProps {
  imageCid: string | undefined;
  altText: string | undefined;
}

const ShowImage = ({ imageCid, altText }: ShowImageProps) => {
  if (!imageCid) {
    return (
      <SImg>
        <Card.Img className='rounded-bottom-0' src='https://placehold.co/312?text=no image' alt='placeholder image' />
      </SImg>
    );
  }

  return (
    <SImg>
      <Card.Img src={`${IPFS_GATEWAY}${imageCid}`} alt={altText} />
    </SImg>
  );
};

export default memo(ShowImage);
