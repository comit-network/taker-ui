import React from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/core';
import CurrencyAmount, { ColorMode } from './CurrencyAmount';
import { Order } from '../utils/order';
import { calculateQuote } from '../utils/currency';
import { useCnd } from '../hooks/useCnd';
import { mutate } from 'swr';
import actionToHttpRequest from '../utils/cnd/action_to_http_request';

export interface MarketOrderProperties {
  orders: Order[];
  label?: string;
  tableContentHeightLock?: string;
}

export default function MyOrderList({
  orders,
  label,
  tableContentHeightLock
}: MarketOrderProperties) {
  const cnd = useCnd();

  const rows = [];
  const currencyValueWidth = '25%';
  const cancelButtonWidth = '30px';

  const currencyValuePadding = '0.3rem';
  const marginTopBottom = '0.3rem';

  for (const order of orders) {
    if (order.state.open.value !== '0' || order.state.settling.value !== '0') {
      const displayColorMode =
        order.position === 'buy' ? ColorMode.CYAN : ColorMode.ORANGE;
      const cancelButtonColor = order.position === 'buy' ? 'cyan' : 'orange';
      const quote = calculateQuote(order.price, order.quantity);

      const cancelAction = order.actions.find(
        action => action.name === 'cancel'
      );

      rows.push(
        <Flex
          direction="row"
          key={`price-${order.id}`}
          padding={currencyValuePadding}
          border="1px"
          borderColor="gray.400"
          rounded="lg"
          marginBottom={marginTopBottom}
          marginTop={marginTopBottom}
          alignItems="center"
          backgroundColor="gray.100"
        >
          <Box width={cancelButtonWidth}>
            {cancelAction && (
              <IconButton
                size="xs"
                aria-label="cancel"
                icon="close"
                onClick={async () => {
                  await cnd.client.request(
                    await actionToHttpRequest(cancelAction)
                  );
                  await mutate('/orders');
                  await mutate('/balance/btc');
                  await mutate('/balance/eth');
                  await mutate('/balance/dai');
                }}
                variantColor={cancelButtonColor}
              />
            )}
          </Box>
          <Box width={currencyValueWidth}>
            <CurrencyAmount
              currencyValue={order.price}
              amountFontSize="sm"
              iconHeight="1rem"
              colourMode={displayColorMode}
              noImage
            />
          </Box>
          <Box width={currencyValueWidth}>
            <CurrencyAmount
              currencyValue={order.quantity}
              amountFontSize="sm"
              iconHeight="1rem"
              colourMode={displayColorMode}
              noImage
            />
          </Box>
          <Box width={currencyValueWidth}>
            <CurrencyAmount
              currencyValue={quote}
              amountFontSize="sm"
              iconHeight="1rem"
              colourMode={displayColorMode}
              noImage
            />
          </Box>
          <Box width={currencyValueWidth}>
            <CurrencyAmount
              currencyValue={order.state.open}
              amountFontSize="sm"
              iconHeight="1rem"
              colourMode={displayColorMode}
              noImage
            />
          </Box>
        </Flex>
      );
    }
  }

  const currencyValHeader = (text, subText) => {
    return (
      <Flex
        direction="row"
        h="25px"
        paddingTop="0.1rem"
        width={currencyValueWidth}
      >
        <Text fontSize="sd" fontWeight="bold" marginRight="0.3rem">
          {text}
        </Text>
        <Text fontSize="xs" fontWeight="bold" color="gray.600">
          {subText}
        </Text>
      </Flex>
    );
  };

  return (
    <Box>
      <Box padding="0.2rem" paddingTop="0">
        <Text textShadow="md" fontSize="lg">
          {label}
        </Text>
      </Box>
      <Box>
        <Flex
          direction="row"
          paddingRight={currencyValuePadding}
          paddingLeft={currencyValuePadding}
        >
          <Box width={cancelButtonWidth} />
          {currencyValHeader('Price', 'DAI')}
          {currencyValHeader('Quantity', 'BTC')}
          {currencyValHeader('Quote', 'DAI')}
          {currencyValHeader('Open', 'BTC')}
        </Flex>
        <Flex
          direction="column"
          overflow="scroll"
          maxHeight={tableContentHeightLock}
        >
          {rows}
        </Flex>
      </Box>
    </Box>
  );
}
