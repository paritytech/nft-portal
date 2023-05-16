import { createElement, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { chains } from '@helpers/config.ts';
import { Chain } from '@helpers/interfaces.ts';
import { CssArrowDown, CssFontSemiBoldS } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useOutsideClick } from '@hooks/useOutsideClick.ts';

import ArrowIcon from '@images/icons/arrow.svg';
import Localhost from '@images/icons/chain-localhost.svg';
import Westmint from '@images/icons/chain-westmint.svg';

const ChainIcons = {
  localhost: Localhost,
  westmint: Westmint,
};

const SContainer = styled.div`
  position: relative;

  svg {
    width: 32px;
  }
`;

const SCurrentChain = styled.button`
  display: flex;
  height: 48px;
  align-items: center;
  padding: 0 8px;
  background-color: ${({ theme }) => theme.fill6};
  color: ${({ theme }) => theme.textAndIconsPrimary};
  border: 0;
  border-radius: 32px;
  gap: 10px;

  span {
    ${CssFontSemiBoldS}
    text-transform: capitalize;
  }

  .arrow-down {
    ${CssArrowDown}
  }
`;

const SChainList = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  padding: 16px;

  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.textAndIconsPrimary};
  border-radius: 16px;
  z-index: 1;

  &.showlist {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const SChainOption = styled.div`
  ${CssFontSemiBoldS}
  display: flex;
  min-width: 184px;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  gap: 8px;

  :hover {
    background-color: ${({ theme }) => theme.appliedHover};
    border-radius: 32px;
    cursor: pointer;
  }

  span {
    text-transform: capitalize;
    white-space: nowrap;
  }
`;

const SelectChain = () => {
  const navigate = useNavigate();
  const { storedChain, setStoredChain } = useAccounts();
  const [isChainListVisible, setIsChainListVisible] = useState(false);
  const dropdownRef = useOutsideClick(() => setIsChainListVisible(false));

  const toggleChainList = () => {
    setIsChainListVisible(!isChainListVisible);
  };

  const selectChain = (chain: Chain) => {
    setIsChainListVisible(false);
    setStoredChain(chain);
    navigate(routes.homepage);
  };

  if (storedChain === null) {
    return null;
  }

  return (
    <SContainer ref={dropdownRef}>
      <SCurrentChain onClick={toggleChainList}>
        {createElement(ChainIcons[storedChain.title])}
        <span>{storedChain.title}</span>
        <ArrowIcon className='arrow-down' />
      </SCurrentChain>
      <SChainList className={isChainListVisible ? 'showlist' : ''}>
        {chains.map((chain: Chain) => (
          <SChainOption onClick={() => selectChain(chain)} key={chain.title}>
            {createElement(ChainIcons[chain.title])}
            <span>{chain.title}</span>
          </SChainOption>
        ))}
      </SChainList>
    </SContainer>
  );
};

export default memo(SelectChain);
