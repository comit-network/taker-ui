import {Box, Flex, Image, Stat, StatHelpText, StatLabel, StatNumber, Tooltip} from '@chakra-ui/core';
import React from 'react';
import {RiCoinLine} from 'react-icons/all';
import BitcoinIcon from '../assets/Bitcoin.svg';
import DaiIcon from '../assets/Dai.svg';
import EthereumIcon from '../assets/Ethereum.svg';
import {amountToUnitString, Currency, CurrencyValue, getCurrencyAndUnit} from '../utils/types';

export enum ColorMode {
  RED = 'RED',
  GREEN = 'GREEN',
  WHITE = 'WHITE',
  ORANGE = 'ORANGE',
  CYAN = 'CYAN',
}

interface CurrencyAmountProps {
  currencyValue: CurrencyValue;
  topText?: string;
  subText1?: string;
  subText2?: string;
  amountShortenPosition?: number;
  amountFontSize?: string;
  iconHeight?: string;
  colourMode?: ColorMode;
  noImage?: boolean;
  showCurrencyText?: boolean;
  minWidth?: string;
}

const currencyIcon = (currency: Currency, iconHeight?: string) => {
  let displayHeight = iconHeight;
  if (!displayHeight) {
    displayHeight = '1.5rem';
  }

  switch (currency) {
    case Currency.BTC:
      return (
        <Image
          src={BitcoinIcon}
          height={displayHeight}
          marginRight="0.5rem"
          alignSelf="center"
        />
      );
    case Currency.DAI:
      return (
        <Image
          src={DaiIcon}
          height={displayHeight}
          marginRight="0.5rem"
          alignSelf="center"
        />
      );
    case Currency.ETH:
      return (
        <Image
          src={EthereumIcon}
          height={displayHeight}
          marginRight="0.5rem"
          alignSelf="center"
        />
      );
    default:
      return (
        <Box
          as={RiCoinLine}
          height={iconHeight}
          marginRight="0.5rem"
          alignSelf="center"
          color="gray"
        />
      );
  }
};

export default function CurrencyAmount({
  currencyValue,
  topText,
  subText1,
  subText2,
  amountFontSize,
  iconHeight,
  colourMode,
    noImage,
    showCurrencyText,
    minWidth
}: CurrencyAmountProps) {
  // TODO: Properly use the decimals instead of using the internal unit
  const { currency } = getCurrencyAndUnit(currencyValue);
  const displayAmount = amountToUnitString(currencyValue);

  let displayNumberColor;
  let displayTextColor;

  if (colourMode) {
    switch (colourMode) {
      case ColorMode.ORANGE:
        displayNumberColor = 'orange.800';
        displayTextColor = 'orange.600';
        break;
      case ColorMode.CYAN:
        displayNumberColor = 'cyan.800';
        displayTextColor = 'cyan.600';
        break;
      case ColorMode.GREEN:
        displayNumberColor = 'green.800';
        displayTextColor = 'green.600';
        break;
      case ColorMode.RED:
        displayNumberColor = 'red.800';
        displayTextColor = 'red.600';
        break;
      case ColorMode.WHITE:
        displayNumberColor = 'white';
        displayTextColor = 'white';
        break;
      default:
        break;
    }
  }

  let displayMinWidth = "100px";
  if (minWidth) {
    displayMinWidth = minWidth;
  }

  const renderAmount = (
    <Flex direction="row">
      <Tooltip
        hasArrow
        aria-label={displayAmount}
        label={`${displayAmount} ${currency}`}
        placement="top"
      >
        <Flex direction="row" alignContent="center" minWidth={displayMinWidth}>
          { noImage ? <></> : currencyIcon(currency, iconHeight)}
          {/* @ts-ignore */}
          <StatNumber
            color={displayNumberColor}
            fontSize={amountFontSize}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {displayAmount}
            {showCurrencyText ? ` ${currency}` : <></>}
          </StatNumber>
        </Flex>
      </Tooltip>
    </Flex>
  );

  let renderTopText;
  let renderSubText1;
  let renderSubText2;

  if (topText) {
    // @ts-ignore
    renderTopText = (
      <StatLabel
        color={displayTextColor}
        minWidth="80px"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {topText}
      </StatLabel>
    );
  }

  if (subText1) {
    // @ts-ignore
    renderSubText1 = (
      <StatHelpText
        color={displayTextColor}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {subText1}
      </StatHelpText>
    );
  }

  if (subText2) {
    // TODO: Fix the hacky minus margin
    // @ts-ignore
    renderSubText2 = (
      <StatHelpText
        color={displayTextColor}
        marginTop="-10px"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {subText2}
      </StatHelpText>
    );
  }

  return (
    <Stat>
      {renderTopText}
      {renderAmount}
      {renderSubText1}
      {renderSubText2}
    </Stat>
  );
}
