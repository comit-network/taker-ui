import React from 'react';
import { Box, Grid, Text } from '@chakra-ui/core';
import CurrencyAmount, { ColorMode } from './CurrencyAmount';
import { MarketOrder } from '../utils/types';

export interface MarketOrderProperties {
  orders: MarketOrder[];
  label?: string;
  colorMode?: ColorMode;
  tableContentHeightLock?: string;
}

// TODO: Refactor this similarly to MyOrderList, handles more comfortable
export default function MarketOrderGrid({
  orders,
  label,
  colorMode,
  tableContentHeightLock
}: MarketOrderProperties) {
  let headerBackgroundColor;
  let headerTextColor;
  let contentBackgroundColor;
  let myOrderBackgroundColour;

  switch (colorMode) {
    case ColorMode.RED:
      headerBackgroundColor = 'orange.800';
      contentBackgroundColor = 'orange.100';
      headerTextColor = 'white';
      myOrderBackgroundColour = 'orange.600';
      break;
    case ColorMode.GREEN:
      headerBackgroundColor = 'cyan.800';
      headerTextColor = 'white';
      contentBackgroundColor = 'cyan.100';
      myOrderBackgroundColour = 'cyan.600';
      break;
    default:
      break;
  }

  const prices = [];
  const quantities = [];

  for (const order of orders) {
    let displayOurBackgroundColor;
    let displayColorMode = colorMode;

    if (order.ours) {
      displayOurBackgroundColor = myOrderBackgroundColour;
      displayColorMode = ColorMode.WHITE;
    }

    prices.push(
      <Box
        key={`price-${order.id}`}
        padding="0.1rem"
        backgroundColor={displayOurBackgroundColor}
      >
        <CurrencyAmount
          currencyValue={order.price}
          amountFontSize="sm"
          iconHeight="1rem"
          colourMode={displayColorMode}
        />
      </Box>
    );

    quantities.push(
      <Box
        key={`quantity-${order.id}`}
        padding="0.1rem"
        backgroundColor={displayOurBackgroundColor}
      >
        <CurrencyAmount
          currencyValue={order.quantity}
          amountFontSize="sm"
          iconHeight="1rem"
          colourMode={displayColorMode}
        />
      </Box>
    );
  }

  const colWidth = '50%';
  let contentHeight;

  if (tableContentHeightLock) {
    contentHeight = tableContentHeightLock;
  }

  const tableHeader = text => {
    return (
      <Box
        w="100%"
        h="25px"
        bg={headerBackgroundColor}
        paddingLeft="0.3rem"
        paddingTop="0.1rem"
      >
        <Text color={headerTextColor} fontSize="sd" fontWeight="bold">
          {text}
        </Text>
      </Box>
    );
  };

  const contentCol = elemList => {
    return <Box w="100%">{elemList}</Box>;
  };

  return (
    <Box>
      <Box padding="0.2rem">
        <Text textShadow="md" fontSize="lg" color={headerBackgroundColor}>
          {label}
        </Text>
      </Box>
      <Box boxShadow="md">
        <Grid
          gridTemplateColumns={`${colWidth} ${colWidth}`}
          gridTemplateRows="20px auto"
          gap={1}
        >
          {tableHeader('Price')}
          {tableHeader('Quantity')}
          <Box w="100%" h="5px" />
        </Grid>
        <Grid
          gridTemplateColumns={`${colWidth} ${colWidth}`}
          height={contentHeight}
          overflow="scroll"
          gap={1}
          backgroundColor={contentBackgroundColor}
        >
          {contentCol(prices)}
          {contentCol(quantities)}
        </Grid>
      </Box>
    </Box>
  );
}