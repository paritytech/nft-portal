import { createElement, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { chains } from '@helpers/config';
import { Chain, Themeable } from '@helpers/interfaces';
import { CssSemiBoldS } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import { useOutsideClick } from '@hooks/useOutsideClick';

import DropdownArrow from '@images/dropdown-arrow.svg';
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

const SCurrentChain = styled.button<Themeable>`
  display: flex;
  height: 48px;
  align-items: center;
  padding: 0 8px;
  background-color: ${({ activeTheme }) => activeTheme.fill6};
  color: ${({ activeTheme }) => activeTheme.textAndIconsPrimary};
  border: 0;
  border-radius: 32px;
  gap: 10px;

  span {
    ${CssSemiBoldS}
    text-transform: capitalize;
  }

  .arrow-down {
    margin: 4px 12px 0 2px;
    width: 15px;
  }
`;

const SChainList = styled.div<Themeable>`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  padding: 16px;

  background-color: ${({ activeTheme }) => activeTheme.backgroundTertiary};
  color: ${({ activeTheme }) => activeTheme.textAndIconsPrimary};
  border-radius: 16px;
  z-index: 1;

  &.showlist {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const SChainOption = styled.div<Themeable>`
  ${CssSemiBoldS}
  display: flex;
  min-width: 184px;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  gap: 8px;

  :hover {
    background-color: ${({ activeTheme }) => activeTheme.fill6};
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
        <DropdownArrow className='arrow-down' />
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
