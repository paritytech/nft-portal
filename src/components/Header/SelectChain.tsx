import { createElement, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { chains } from '@helpers/config.ts';
import { Chain } from '@helpers/interfaces.ts';
import { CssArrowDown, CssArrowTertiary, CssFontSemiBoldS } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useOutsideClick } from '@hooks/useOutsideClick.ts';

import ArrowIcon from '@images/icons/arrow.svg';
import Localhost from '@images/icons/chain-localhost.svg';
import Westmint from '@images/icons/chain-westmint.svg';
import TickIcon from '@images/icons/tick.svg';

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
  background-color: transparent;
  color: ${({ theme }) => theme.textAndIconsPrimary};
  border: 0;
  border-radius: 32px;
  gap: 10px;

  &:hover,
  &.chainlist-active {
    background-color: ${({ theme }) => theme.appliedHover};
  }

  span {
    ${CssFontSemiBoldS}
    text-transform: capitalize;
  }

  .arrow-down {
    ${CssArrowTertiary}
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
  border-radius: 12px;
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
  position: relative;
  min-width: 221px;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  gap: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.appliedHover};
    border-radius: 8px;
    cursor: pointer;
  }

  span {
    text-transform: capitalize;
    white-space: nowrap;
  }
`;

const SActiveChain = styled.div`
  position: absolute;
  right: 8px;

  svg {
    width: 24px;
  }
`;

const SelectChain = () => {
  const navigate = useNavigate();
  const { storedChain, setStoredChain } = useAccounts();
  const [isChainListVisible, setIsChainListVisible] = useState(false);
  const dropdownRef = useOutsideClick(() => setIsChainListVisible(false));

  useEffect(() => {
    const currentChain = document.getElementById('current-chain');

    if (currentChain !== null) {
      if (isChainListVisible) {
        currentChain.classList.add('chainlist-active');
      } else {
        currentChain.classList.remove('chainlist-active');
      }
    }
  }, [isChainListVisible]);

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
      <SCurrentChain id='current-chain' onClick={toggleChainList}>
        {createElement(ChainIcons[storedChain.title])}
        <ArrowIcon className='arrow-down' />
      </SCurrentChain>
      <SChainList className={isChainListVisible ? 'showlist' : ''}>
        {chains.map((chain: Chain) => (
          <SChainOption onClick={() => selectChain(chain)} key={chain.title}>
            {createElement(ChainIcons[chain.title])}
            <span>{chain.title}</span>
            {chain.title === storedChain.title && (
              <SActiveChain>
                <TickIcon />
              </SActiveChain>
            )}
          </SChainOption>
        ))}
      </SChainList>
    </SContainer>
  );
};

export default memo(SelectChain);
