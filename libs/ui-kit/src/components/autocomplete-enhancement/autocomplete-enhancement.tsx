'use client';

import { debounce } from '@mui/material/utils';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import ESPAutocomplete from '../autocomplete/autocomplete';
import { ListboxComponent, LoadingComponent } from './components';
import { ESPAutocompleteEnhancementProps } from './type';

export const ESPAutocompleteEnhancement = React.forwardRef(
  (
    {
      size = 'medium',
      placeholder = 'Autocomplete',
      options,
      limitTags,
      onChange,
      seachingLocal,
      loadData: loadDataFunc,
      ...props
    }: ESPAutocompleteEnhancementProps,
    _ref
  ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasLoadMore] = useState(true);
    // const [options] = useState(initOptions);
    const refLoading = useRef(false);

    const loadData = useCallback(async () => {
      if (typeof loadDataFunc === 'function') {
        setLoading(true);
        try {
          await loadDataFunc();
        } finally {
          setLoading(false);
        }
      }
    }, []);

    const onSearch = useMemo(
      () =>
        debounce(async (value: string, reason: string) => {
          await loadData();
          refLoading.current = false;
        }, 400),
      [loadData]
    );

    return (
      <ESPAutocomplete
        placeholder={placeholder}
        options={refLoading.current ? [] : options}
        open={open}
        onOpen={() => {
          setOpen(!open);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={onChange}
        loading={loading}
        ListboxComponent={ListboxComponent}
        ListboxProps={{
          // @ts-expect-error: IGNORE
          loadData,
          loading,
          hasLoadMore,
        }}
        onInputChange={(_, value, reason) => {
          if (!seachingLocal) {
            refLoading.current = true;
            onSearch(value, reason);
          }
        }}
        loadingText={<LoadingComponent />}
        {...props}
      />
    );
  }
);

ESPAutocompleteEnhancement.displayName = 'ESPAutocompleteEnhancement';

export default ESPAutocompleteEnhancement;
