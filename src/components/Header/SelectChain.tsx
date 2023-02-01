import { memo, useState } from 'react';
import styled from 'styled-components';

import Localhost from '@assets/chain-localhost.svg';
import Westmint from '@assets/chain-westmint.svg';

import { useAccounts } from '@contexts/AccountContext';

import { chains } from '@helpers/config';
import { Chain } from '@helpers/interfaces';
import { styleSettings } from '@helpers/reusableStyles';

import { useOutsideClick } from '@hooks/useOutsideClick';

const chainIcons = {
  localhost: Localhost,
  westmint: Westmint,
};

const SContainer = styled.div`
  position: relative;

  svg {
    width: 34px;
  }
`;

const SCurrentChain = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  :hover {
    cursor: pointer;
  }
`;

const SChainList = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background-color: ${styleSettings.colors.white};
  border: 2px solid ${styleSettings.colors.cerise};
  border-radius: 10px;
  z-index: 1;

  &.showlist {
    display: block;
  }
`;

const STriangle = styled.span`
  position: absolute;
  top: -9px;
  right: 8px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid ${styleSettings.colors.cerise};
`;

const SChainOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;

  :hover {
    background-color: ${styleSettings.colors.cerise};
    color: ${styleSettings.colors.white};
    cursor: pointer;
  }

  :first-of-type {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }

  :last-of-type {
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }

  span {
    white-space: nowrap;
  }
`;

const SelectChain = () => {
  const { storedChain, setupApi } = useAccounts();
  const [isChainListVisible, setIsChainListVisible] = useState(false);
  const dropdownRef = useOutsideClick(() => setIsChainListVisible(false));

  const toggleChainList = () => {
    setIsChainListVisible(!isChainListVisible);
  };

  const selectChain = (chain: Chain) => {
    setIsChainListVisible(false);
    setupApi(chain);
  };

  if (storedChain === null) {
    return null;
  }

  const ChainIcon = chainIcons[storedChain.title];

  return (
    <SContainer ref={dropdownRef}>
      <SCurrentChain onClick={toggleChainList}>
        <ChainIcon />
      </SCurrentChain>
      <SChainList className={isChainListVisible ? 'showlist' : ''}>
        <STriangle />
        {chains.map((chain) => {
          const ChainIcon = chainIcons[chain.title];

          return (
            <SChainOption onClick={() => selectChain(chain)} key={chain.title}>
              <ChainIcon />
              <span>{chain.title}</span>
            </SChainOption>
          );
        })}
      </SChainList>
    </SContainer>
  );
};

export default memo(SelectChain);
