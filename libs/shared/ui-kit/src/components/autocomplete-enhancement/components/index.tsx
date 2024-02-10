import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { createContext, forwardRef, useContext, useEffect, useRef } from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;

  const dataSet = data[index];

  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    width: 'calc(100% - 1rem)',
    marginLeft: '0.5rem',
  };

  return React.cloneElement(dataSet, {
    style: inlineStyle,
  });
}

function useResetCache(data: unknown) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

interface IVirtualScrollingComponentProps {
  children: React.ReactNode;
  loadData: () => void;
  loading: boolean;
  itemSize: number;
  [key: string]: unknown;
}

export const ListboxComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const outerRef = useRef<HTMLDivElement>();
    const { children, loadData, loading, hasLoadMore, ...other } =
      props as IVirtualScrollingComponentProps;

    const itemData: React.ReactNode[] = [];
    (children as React.ReactNode[]).forEach((item) => {
      itemData.push(item);
    });

    if (loading) {
      itemData.push(
        React.createElement('li', {
          className: 'MuiAutocomplete-option',
          children: <LoadingComponent />,
          role: 'button',
          tabIndex: -1,
          'aria-disabled': true,
        })
      );
    }

    const itemCount = itemData.length;
    const itemSize = 40;

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={itemCount * itemSize + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerRef={outerRef}
            innerElementType="ul"
            outerElementType={OuterElementType}
            itemSize={() => itemSize}
            itemCount={itemCount}
            style={{
              padding: 0,
            }}
            onScroll={async (event) => {
              const listboxNode = outerRef.current;

              const shouldLoadData =
                typeof loadData === 'function' &&
                !loading &&
                hasLoadMore &&
                event.scrollOffset !== 0;

              if (
                listboxNode &&
                event.scrollOffset + listboxNode.clientHeight >= listboxNode.scrollHeight &&
                shouldLoadData
              ) {
                await loadData();
              }
            }}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  }
);

// Adapter for react-window
export const VirtualScrollingComponent = forwardRef<
  HTMLDivElement,
  IVirtualScrollingComponentProps
>((props, ref) => {
  const outerRef = useRef<HTMLDivElement>();

  const { children, loadData, loading, hasLoadMore, itemSize: initItemSize, ...other } = props;

  const itemData: React.ReactNode[] = [];
  (children as React.ReactNode[]).forEach((item) => {
    itemData.push(item);
  });

  if (loading) {
    itemData.push(
      React.createElement('li', {
        className: 'MuiAutocomplete-option',
        style: { display: 'flex' },
        children: <LoadingComponent />,
        role: 'button',
        tabIndex: -1,
        'aria-disabled': true,
      })
    );
  }

  const itemCount = itemData.length;
  const itemSize = initItemSize || 40;

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={itemCount * itemSize + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerRef={outerRef}
          innerElementType="ul"
          outerElementType={OuterElementType}
          itemSize={() => itemSize}
          itemCount={itemCount}
          style={{
            padding: 0,
          }}
          onScroll={async (event) => {
            const listboxNode = outerRef.current;

            const shouldLoadData =
              typeof loadData === 'function' && !loading && hasLoadMore && event.scrollOffset !== 0;

            if (
              listboxNode &&
              event.scrollOffset + listboxNode.clientHeight >= listboxNode.scrollHeight &&
              shouldLoadData
            ) {
              await loadData();
            }
          }}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

export const LoadingComponent = () => (
  <Box display="flex" justifyContent="center" alignItems="center" width={'100%'}>
    <CircularProgress color="primary" size={20} />
  </Box>
);
