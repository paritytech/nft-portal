export interface CommonStyleProps {
  className?: string;
  isDisabled?: boolean;
}

export interface CollectionMetadata extends CollectionMetadataData {
  id: string;
}

export interface CollectionMetadataData {
  name: string;
  description?: string;
  image?: string;
}
