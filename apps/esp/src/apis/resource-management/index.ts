// import { mockDataOrganizations } from '@esp/__mocks__/data-mock';

import request from '../axios';
import { IBaseAPIResponse } from '../types';

export const RESOURCE_MANAGEMENT_API_PATH = {
  units: '/resource-management/v1/units',
};

interface Employee {
  employeeId: string;
  userName: string;
  email: string;
  fullName: string;
}

export interface IDataUnit {
  unitName: string;
  unitId: string;
  manager: {
    managerName: string;
    managerId: string;
  };
  employees: Employee[];
  childs?: IDataUnit[];
}

export type IGetUnitsByEmployeeId = IBaseAPIResponse<IDataUnit[]>;

export const getUnitsByEmployeeId = (employeedId: string): Promise<IGetUnitsByEmployeeId> => {
  return request.get(`${RESOURCE_MANAGEMENT_API_PATH.units}/${employeedId}`);

  // return {
  //   data: mockDataOrganizations,
  // };
};
