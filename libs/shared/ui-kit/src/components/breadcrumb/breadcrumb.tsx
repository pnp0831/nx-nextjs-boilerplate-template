import { memo } from 'react';

import { ESPTypography } from '../typography/typography';
import { BreadcrumbsComponent } from './components';
import { ESPBreadcrumbsProps } from './type';

export const ESPBreadcrumbs = memo(
  ({ breadcrumbs, component: Component, ...props }: ESPBreadcrumbsProps) => {
    return (
      <BreadcrumbsComponent aria-label="breadcrumb" {...props}>
        {breadcrumbs.map(({ href, name }) => {
          if (href) {
            if (Component) {
              return (
                // @ts-expect-error: IGNORE
                <Component href={href} key={name}>
                  {name}
                </Component>
              );
            }

            return (
              <a href={href} key={name}>
                {name}
              </a>
            );
          }

          return (
            <ESPTypography key={name} variant="regular_s">
              {name}
            </ESPTypography>
          );
        })}
      </BreadcrumbsComponent>
    );
  }
);

export default ESPBreadcrumbs;
