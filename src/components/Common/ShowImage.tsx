import { memo } from 'react';
import styled from 'styled-components';
import Card from 'react-bootstrap/Card';

import { IPFS_URL } from '@helpers/config';

const SImg = styled.div`
  img {
    width: 250px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

interface ShowImageProps {
  image: string | undefined;
  altText: string | undefined;
}

const ShowImage = ({ image, altText }: ShowImageProps) => {
  if (!image) {
    return (
      <SImg>
        <Card.Img className='rounded-bottom-0' src='https://placehold.co/250' alt='placeholder image for collection' />
      </SImg>
    );
  }

  return (
    <SImg>
      <Card.Img src={`${IPFS_URL}${image}`} alt={altText} />
    </SImg>
  );
};

export default memo(ShowImage);
