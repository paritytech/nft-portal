import { memo } from 'react';
import Card from 'react-bootstrap/esm/Card';
import styled from 'styled-components';

import { IPFS_URL } from '@helpers/config';

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
        <Card.Img className='rounded-bottom-0' src='https://placehold.co/250' alt='placeholder image' />
      </SImg>
    );
  }

  return (
    <SImg>
      <Card.Img src={`${IPFS_URL}${imageCid}`} alt={altText} />
    </SImg>
  );
};

export default memo(ShowImage);
