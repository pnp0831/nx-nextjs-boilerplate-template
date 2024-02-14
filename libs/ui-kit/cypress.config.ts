import { nxComponentTestingPreset } from '@nx/next/plugins/component-testing';
import { defineConfig } from 'cypress';

export default defineConfig({
  component: nxComponentTestingPreset(__filename, {}),
});
