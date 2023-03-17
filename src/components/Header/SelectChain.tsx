import { createElement, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { chains } from '@helpers/config';
import { Chain, Themeable } from '@helpers/interfaces';
import { styleSettings } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import { useOutsideClick } from '@hooks/useOutsideClick';

import Localhost from '@images/chain-localhost.svg';
import Westmint from '@images/chain-westmint.svg';
import DropdownArrow from '@images/dropdown-arrow.svg';

const ChainIcons = {
  localhost: Localhost,
  westmint: Westmint,
};

const SContainer = styled.div`
  position: relative;
  height: 40px;
  line-height: 40px;

  svg {
    width: 24px;
  }
`;

const SCurrentChain = styled.button<Themeable>`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: ${({ activeTheme }) => activeTheme.navigationButtonActiveBackgroundColor};
  color: ${({ activeTheme }) => activeTheme.navigationButtonTextColor};
  border: 0;
  border-radius: 32px;
  gap: 10px;

  svg {
    margin-top: 4px;
  }
`;

const SChainList = styled.div<Themeable>`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background-color: ${({ activeTheme }) => activeTheme.navigationBackground};
  border-radius: 16px;
  z-index: 1;

  &.showlist {
    display: block;
  }
`;

const SChainOption = styled.div<Themeable>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;

  :hover {
    background-color: ${({ activeTheme }) => activeTheme.blockBackgroundColorHover};
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
  const navigate = useNavigate();
  const { storedChain, setStoredChain, theme } = useAccounts();
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
      <SCurrentChain onClick={toggleChainList} activeTheme={theme}>
        {createElement(ChainIcons[storedChain.title])}
        <span>{storedChain.title}</span>
        <DropdownArrow />
      </SCurrentChain>
      <SChainList className={isChainListVisible ? 'showlist' : ''} activeTheme={theme}>
        {chains.map((chain) => (
          <SChainOption onClick={() => selectChain(chain)} key={chain.title} activeTheme={theme}>
            {createElement(ChainIcons[chain.title])}
            <span>{chain.title}</span>
          </SChainOption>
        ))}
      </SChainList>
    </SContainer>
  );
};

export default memo(SelectChain);
