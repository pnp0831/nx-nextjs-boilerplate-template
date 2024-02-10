'use client';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PaginationRenderItemParams } from '@mui/material/Pagination';
import PaginationItem, { PaginationItemProps } from '@mui/material/PaginationItem';
import React from 'react';

import { NextButton, PaginationComponent, PreviousButton } from './components';
import { ESPPaginationProps } from './type';

export function ESPPagination({
  showNextLabel,
  showPrevLabel,
  onPageChange = () => {},
  page,
  ...props
}: ESPPaginationProps) {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(event, value);

    if (typeof props.onChange === 'function') {
      props.onChange(event, value);
    }
  };

  return (
    <PaginationComponent
      {...props}
      page={page}
      onChange={handleChange}
      color="primary"
      shape="rounded"
      renderItem={(item: PaginationRenderItemParams) => {
        const paginationProps = item as PaginationItemProps;
        return (
          // TODO: define type
          // @ts-expect-error: IGNORE
          <PaginationItem
            {...paginationProps}
            slots={{
              previous: showPrevLabel ? PreviousButton : ArrowBackIosIcon,
              next: showNextLabel ? NextButton : ArrowForwardIosIcon,
            }}
          />
        );
      }}
    />
  );
}

export default ESPPagination;
