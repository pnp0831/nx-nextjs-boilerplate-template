'use client';

import { getUnitsByEmployeeId, IDataUnit } from '@esp/apis/resource-management';
import useAuth from '@esp/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import loUniqBy from 'lodash/uniqBy';
import { useCallback, useEffect, useState } from 'react';

import { IOrganizationUnitOptions } from './organizations-select.type';

// 3 is level of team
// Example: SSTVN - Division - [TEAM]

const TEAMS_LEVEL = 3;

export const SPEC_CHAR_FOR_REPLACE = '***';
export const SPEC_CHAR_FOR_AVOID_DUPLICATE_UNIT_NAME = '!!!';

export function useGetUnits(employeeIdDemo?: string) {
  const { user } = useAuth();
  const [optionUnits, setOptonUnits] = useState<IOrganizationUnitOptions[]>([]);
  const [employees, setEmployees] = useState<{ [key: string]: { id: string; name: string } }>({});

  // TODO: Remove after QA testing this feature.
  const employeeId = (employeeIdDemo || user?.employeeId) as string;

  const { data, isFetching } = useQuery({
    queryKey: ['units', employeeId],
    queryFn: () => getUnitsByEmployeeId(employeeId),
  });

  const initUnitOptions = useCallback(
    (
      data: IDataUnit[],
      params?: { parentId?: string; parentName?: string; level: number; belongToUnitName: string[] }
    ) => {
      const results: IOrganizationUnitOptions[] = [];

      const {
        parentId = undefined,
        parentName = undefined,
        level = 1,
        belongToUnitName = [],
      } = params || {};

      data.forEach((units) => {
        if (units.unitId) {
          results.push({
            belongToUnitName: (level > TEAMS_LEVEL
              ? `${belongToUnitName.join(SPEC_CHAR_FOR_REPLACE)}`
              : parentName) as string,
            level,
            label: units.unitName,
            value: units.unitId,
            parentId,
            parentName,
            isUnit: true,
          });

          if (units.childs?.length) {
            const recursiveData = initUnitOptions(units.childs, {
              level: level + 1,
              parentId: units.unitId,
              parentName: units.unitName,
              belongToUnitName:
                level >= TEAMS_LEVEL ? [...belongToUnitName, units.unitName] : [units.unitName],
            }) as IOrganizationUnitOptions[];

            results.push(...recursiveData);
          }
        }
      });

      return results;
    },
    []
  );

  const initEmployeeOptions = useCallback(
    (
      data: IDataUnit[],
      params?: {
        parentId?: string;
        parentName?: string;
        level: number;
        belongToUnitName?: string[];
      }
    ) => {
      const results: IOrganizationUnitOptions[] = [];

      const {
        parentId = undefined,
        parentName = undefined,
        level = 1,
        belongToUnitName = [],
      } = params || {};

      data.forEach((units) => {
        if (units.employees?.length) {
          units.employees.forEach((e) => {
            results.push({
              level,
              label: e.fullName || e.userName,
              value: e.employeeId,
              email: e.email,
              isEmployee: true,
              parentId: parentId || units.unitId,
              parentName: parentName || units.unitName,
              isManager: e.employeeId === units.manager?.managerId,
              belongToUnitName:
                level >= TEAMS_LEVEL
                  ? belongToUnitName.concat(units.unitName).join(SPEC_CHAR_FOR_REPLACE)
                  : `${units.unitName} ${SPEC_CHAR_FOR_AVOID_DUPLICATE_UNIT_NAME}`,
            });
          });

          if (units.childs?.length) {
            // why level +1
            //bc: the childs is nestest obj -> level +1
            const recursiveData = initEmployeeOptions(units.childs, {
              level: level + 1,
              parentId: units.unitId,
              parentName: units.unitName,
              belongToUnitName:
                level + 1 > TEAMS_LEVEL ? [...belongToUnitName, units.unitName] : [units.unitName],
            }) as IOrganizationUnitOptions[];

            results.push(...recursiveData);
          }
        }
      });

      return results;
    },
    []
  );

  useEffect(() => {
    if (data) {
      const { data: dataResponse } = data;

      const unitsOptions = initUnitOptions(dataResponse as IDataUnit[]);
      const employeeOptions = loUniqBy(initEmployeeOptions(dataResponse as IDataUnit[]), 'value');

      const results = [
        ...unitsOptions.sort((a, b) => Number(a.level) - Number(b.level)),
        ...employeeOptions.sort((a, b) => Number(a.level) - Number(b.level)),
      ];

      setOptonUnits(results);

      const employees = employeeOptions.reduce(
        (acc, cur) => ({ ...acc, [cur.value]: { name: cur.label, id: cur.value } }),
        {}
      );

      setEmployees(employees);
    }
  }, [data, initEmployeeOptions, initUnitOptions]);

  return {
    optionUnits,
    employees,
    loading: isFetching,
  };
}

export const getEmployeeIds = (
  units: IOrganizationUnitOptions[],
  optionUnits: IOrganizationUnitOptions[]
) => {
  const results: string[] = [];

  units?.forEach((unit) => {
    if (unit?.isEmployee) {
      results.push(unit.value as string);
    }

    if (unit?.isUnit) {
      const currentUnit = optionUnits.filter((c) => c.parentId === unit.value);
      const recursiveData = getEmployeeIds(currentUnit, optionUnits);

      results.push(...recursiveData);
    }
  });

  return results;
};
